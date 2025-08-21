from uagents import Agent, Context, Model
import json
import time
import math
from typing import Dict, List, Optional
from collections import defaultdict

# Definisikan model pesan
class TransactionLogMessage(Model):
    transaction_id: str
    provider_id: str
    requester_id: str
    status: str
    data_hash_verified: bool
    price: float
    quality_rating: float

class ReputationQueryMessage(Model):
    provider_id: str

class ReputationUpdateMessage(Model):
    provider_id: str
    new_reputation: float
    reason: str

class ReputationReportMessage(Model):
    provider_id: str
    reputation_score: float
    total_transactions: int
    success_rate: float
    average_quality: float
    last_updated: float

agent = Agent(name="reputation_agent", seed="reputation_agent_seed")

# Penyimpanan reputasi yang lebih kompleks
reputation_data = defaultdict(lambda: {
    "score": 5.0,  # Skor awal
    "total_transactions": 0,
    "successful_transactions": 0,
    "failed_transactions": 0,
    "total_quality_rating": 0.0,
    "transaction_history": [],
    "last_updated": time.time(),
    "reputation_history": []
})

# Konfigurasi algoritma reputasi
REPUTATION_CONFIG = {
    "initial_score": 5.0,
    "max_score": 10.0,
    "min_score": 0.0,
    "success_weight": 0.4,
    "quality_weight": 0.3,
    "consistency_weight": 0.2,
    "recency_weight": 0.1,
    "decay_factor": 0.95,  # Faktor peluruhan untuk transaksi lama
    "min_transactions_for_stability": 5
}

def calculate_time_decay(timestamp: float, current_time: float, decay_factor: float = 0.95) -> float:
    """Menghitung faktor peluruhan berdasarkan waktu"""
    days_passed = (current_time - timestamp) / (24 * 3600)  # Konversi ke hari
    return math.pow(decay_factor, days_passed)

def calculate_consistency_score(transaction_history: List[dict]) -> float:
    """Menghitung skor konsistensi berdasarkan variabilitas performa"""
    if len(transaction_history) < 2:
        return 1.0
    
    # Hitung variabilitas kualitas
    quality_scores = [t["quality_rating"] for t in transaction_history if t["status"] == "success"]
    
    if len(quality_scores) < 2:
        return 1.0
    
    # Hitung standar deviasi
    mean_quality = sum(quality_scores) / len(quality_scores)
    variance = sum((q - mean_quality) ** 2 for q in quality_scores) / len(quality_scores)
    std_dev = math.sqrt(variance)
    
    # Konversi ke skor konsistensi (0-1, dimana 1 = sangat konsisten)
    max_std_dev = 3.0  # Asumsi maksimal standar deviasi
    consistency_score = max(0, 1 - (std_dev / max_std_dev))
    
    return consistency_score

def calculate_weighted_reputation(provider_data: dict) -> float:
    """Menghitung reputasi berdasarkan berbagai faktor dengan bobot"""
    current_time = time.time()
    config = REPUTATION_CONFIG
    
    if provider_data["total_transactions"] == 0:
        return config["initial_score"]
    
    # 1. Success Rate Score
    success_rate = provider_data["successful_transactions"] / provider_data["total_transactions"]
    success_score = success_rate * config["max_score"]
    
    # 2. Quality Score
    if provider_data["successful_transactions"] > 0:
        average_quality = provider_data["total_quality_rating"] / provider_data["successful_transactions"]
        quality_score = (average_quality / 10.0) * config["max_score"]
    else:
        quality_score = 0.0
    
    # 3. Consistency Score
    consistency_score = calculate_consistency_score(provider_data["transaction_history"]) * config["max_score"]
    
    # 4. Recency Score (berdasarkan aktivitas terbaru)
    if provider_data["transaction_history"]:
        last_transaction_time = max(t["timestamp"] for t in provider_data["transaction_history"])
        recency_factor = calculate_time_decay(last_transaction_time, current_time, 0.99)
        recency_score = recency_factor * config["max_score"]
    else:
        recency_score = config["initial_score"]
    
    # Hitung skor total dengan bobot
    total_score = (
        config["success_weight"] * success_score +
        config["quality_weight"] * quality_score +
        config["consistency_weight"] * consistency_score +
        config["recency_weight"] * recency_score
    )
    
    # Terapkan stabilitas untuk provider baru
    if provider_data["total_transactions"] < config["min_transactions_for_stability"]:
        stability_factor = provider_data["total_transactions"] / config["min_transactions_for_stability"]
        total_score = config["initial_score"] * (1 - stability_factor) + total_score * stability_factor
    
    # Pastikan skor dalam range yang valid
    return max(config["min_score"], min(config["max_score"], total_score))

def apply_time_decay_to_history(provider_data: dict):
    """Terapkan peluruhan waktu ke histori transaksi"""
    current_time = time.time()
    decay_factor = REPUTATION_CONFIG["decay_factor"]
    
    # Terapkan decay ke setiap transaksi dalam histori
    for transaction in provider_data["transaction_history"]:
        if "original_quality" not in transaction:
            transaction["original_quality"] = transaction["quality_rating"]
        
        time_decay = calculate_time_decay(transaction["timestamp"], current_time, decay_factor)
        transaction["effective_quality"] = transaction["original_quality"] * time_decay

# Handler untuk log transaksi
@agent.on_message(model=TransactionLogMessage)
async def handle_transaction_log(ctx: Context, sender: str, msg: TransactionLogMessage):
    ctx.logger.info(f"Log transaksi diterima dari {sender}: {msg.transaction_id}, Provider: {msg.provider_id}, Status: {msg.status}")
    
    provider_id = msg.provider_id
    provider_data = reputation_data[provider_id]
    
    # Update statistik dasar
    provider_data["total_transactions"] += 1
    
    if msg.status == "success" and msg.data_hash_verified:
        provider_data["successful_transactions"] += 1
        provider_data["total_quality_rating"] += msg.quality_rating
    else:
        provider_data["failed_transactions"] += 1
    
    # Tambahkan ke histori transaksi
    transaction_record = {
        "transaction_id": msg.transaction_id,
        "requester_id": msg.requester_id,
        "status": msg.status,
        "data_hash_verified": msg.data_hash_verified,
        "price": msg.price,
        "quality_rating": msg.quality_rating,
        "timestamp": time.time()
    }
    
    provider_data["transaction_history"].append(transaction_record)
    
    # Batasi histori untuk performa (simpan 100 transaksi terakhir)
    if len(provider_data["transaction_history"]) > 100:
        provider_data["transaction_history"] = provider_data["transaction_history"][-100:]
    
    # Terapkan time decay ke histori
    apply_time_decay_to_history(provider_data)
    
    # Hitung reputasi baru
    old_reputation = provider_data["score"]
    new_reputation = calculate_weighted_reputation(provider_data)
    
    provider_data["score"] = new_reputation
    provider_data["last_updated"] = time.time()
    
    # Simpan histori perubahan reputasi
    reputation_change = {
        "timestamp": time.time(),
        "old_score": old_reputation,
        "new_score": new_reputation,
        "transaction_id": msg.transaction_id,
        "reason": f"Transaction {msg.status} - Quality: {msg.quality_rating}"
    }
    
    provider_data["reputation_history"].append(reputation_change)
    
    # Batasi histori reputasi
    if len(provider_data["reputation_history"]) > 50:
        provider_data["reputation_history"] = provider_data["reputation_history"][-50:]
    
    ctx.logger.info(f"Reputasi {provider_id} diperbarui: {old_reputation:.2f} -> {new_reputation:.2f}")
    
    # Kirim update reputasi ke requester jika ada perubahan signifikan
    if abs(new_reputation - old_reputation) > 0.5:
        update_msg = ReputationUpdateMessage(
            provider_id=provider_id,
            new_reputation=new_reputation,
            reason=f"Significant change due to transaction {msg.transaction_id}"
        )
        await ctx.send(sender, update_msg)

# Handler untuk query reputasi
@agent.on_message(model=ReputationQueryMessage)
async def handle_reputation_query(ctx: Context, sender: str, msg: ReputationQueryMessage):
    ctx.logger.info(f"Query reputasi diterima dari {sender} untuk provider {msg.provider_id}")
    
    provider_data = reputation_data[msg.provider_id]
    
    # Hitung statistik
    success_rate = 0.0
    average_quality = 0.0
    
    if provider_data["total_transactions"] > 0:
        success_rate = provider_data["successful_transactions"] / provider_data["total_transactions"]
    
    if provider_data["successful_transactions"] > 0:
        average_quality = provider_data["total_quality_rating"] / provider_data["successful_transactions"]
    
    # Buat laporan reputasi
    report = ReputationReportMessage(
        provider_id=msg.provider_id,
        reputation_score=provider_data["score"],
        total_transactions=provider_data["total_transactions"],
        success_rate=success_rate,
        average_quality=average_quality,
        last_updated=provider_data["last_updated"]
    )
    
    await ctx.send(sender, report)
    ctx.logger.info(f"Laporan reputasi dikirim ke {sender} untuk {msg.provider_id}: {provider_data['score']:.2f}")

# Fungsi untuk maintenance periodik
async def periodic_maintenance(ctx: Context):
    """Maintenance periodik untuk membersihkan data lama dan recalculate reputasi"""
    current_time = time.time()
    
    for provider_id, provider_data in reputation_data.items():
        # Terapkan time decay
        apply_time_decay_to_history(provider_data)
        
        # Recalculate reputasi
        old_score = provider_data["score"]
        new_score = calculate_weighted_reputation(provider_data)
        
        if abs(new_score - old_score) > 0.01:  # Update jika ada perubahan signifikan
            provider_data["score"] = new_score
            provider_data["last_updated"] = current_time
            
            ctx.logger.info(f"Maintenance: Reputasi {provider_id} diperbarui: {old_score:.2f} -> {new_score:.2f}")

# Fungsi untuk mendapatkan statistik global
def get_global_reputation_stats() -> dict:
    """Mendapatkan statistik reputasi global"""
    if not reputation_data:
        return {
            "total_providers": 0,
            "average_reputation": 0.0,
            "total_transactions": 0,
            "global_success_rate": 0.0
        }
    
    total_providers = len(reputation_data)
    total_reputation = sum(data["score"] for data in reputation_data.values())
    average_reputation = total_reputation / total_providers
    
    total_transactions = sum(data["total_transactions"] for data in reputation_data.values())
    total_successful = sum(data["successful_transactions"] for data in reputation_data.values())
    
    global_success_rate = total_successful / total_transactions if total_transactions > 0 else 0.0
    
    return {
        "total_providers": total_providers,
        "average_reputation": average_reputation,
        "total_transactions": total_transactions,
        "global_success_rate": global_success_rate
    }

if __name__ == "__main__":
    agent.run()
