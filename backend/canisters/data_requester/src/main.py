from uagents import Agent, Context, Model
import json
import hashlib
import time
from typing import Dict, List, Optional

# Definisikan model pesan
class DataQueryMessage(Model):
    query_type: str
    criteria: dict
    requester_id: str
    max_price: Optional[float] = None
    min_quality: Optional[float] = None

class DataOfferMessage(Model):
    provider_id: str
    price: float
    data_hash: str
    reputation: float
    data_size: int
    quality_score: float
    availability: str
    offer_id: str

class PurchaseMessage(Model):
    offer_id: str
    requester_id: str
    payment_hash: str

class DataDeliveryMessage(Model):
    transaction_id: str
    data_payload: str
    verification_hash: str

class TransactionLogMessage(Model):
    transaction_id: str
    provider_id: str
    requester_id: str
    status: str
    data_hash_verified: bool
    price: float
    quality_rating: float

class LogMessage(Model):
    log_entry: str

class MetricMessage(Model):
    totalTransactions: int
    averagePricePerDataUnit: float
    networkLatency: int

class NetworkDataMessage(Model):
    nodes: list
    links: list

class LogQueryMessage(Model):
    query: str

class MetricQueryMessage(Model):
    query: str

class NetworkQueryMessage(Model):
    query: str

# Inisialisasi agen
agent = Agent(name="data_requester_agent", seed="data_requester_seed")

# Penyimpanan data
logs_storage = []
metrics_storage = {"totalTransactions": 0, "averagePricePerDataUnit": 0.0, "networkLatency": 0}
network_data_storage = {
    "nodes": [{"id": "requester", "name": "Data Requester Agent", "type": "requester"}], 
    "links": []
}

# Penyimpanan untuk negosiasi
pending_offers = {}
active_negotiations = {}
transaction_history = []
reputation_agent_address = "reputation_agent"  # Address agen reputasi

def calculate_offer_score(offer: DataOfferMessage, weights: dict = None) -> float:
    """Menghitung skor penawaran berdasarkan berbagai faktor"""
    if weights is None:
        weights = {
            "price": 0.4,      # Bobot untuk harga (semakin rendah semakin baik)
            "quality": 0.3,    # Bobot untuk kualitas
            "reputation": 0.2, # Bobot untuk reputasi
            "size": 0.1        # Bobot untuk ukuran data
        }
    
    # Normalisasi harga (asumsi range 0-1000)
    price_score = max(0, (1000 - offer.price) / 1000)
    
    # Normalisasi kualitas (asumsi range 0-10)
    quality_score = offer.quality_score / 10
    
    # Normalisasi reputasi (asumsi range 0-10)
    reputation_score = offer.reputation / 10
    
    # Normalisasi ukuran data (asumsi range 0-10000)
    size_score = min(1, offer.data_size / 10000)
    
    # Hitung skor total
    total_score = (
        weights["price"] * price_score +
        weights["quality"] * quality_score +
        weights["reputation"] * reputation_score +
        weights["size"] * size_score
    )
    
    return total_score

def generate_payment_hash(offer_id: str, amount: float) -> str:
    """Generate payment hash untuk simulasi pembayaran"""
    payment_data = f"{offer_id}_{amount}_{time.time()}"
    return hashlib.sha256(payment_data.encode()).hexdigest()

# Handler untuk menerima penawaran data
@agent.on_message(model=DataOfferMessage)
async def handle_data_offer(ctx: Context, sender: str, msg: DataOfferMessage):
    ctx.logger.info(f"Penawaran diterima dari {sender}: {msg.offer_id} - Harga: {msg.price}, Kualitas: {msg.quality_score}")
    
    # Simpan penawaran untuk evaluasi
    if msg.offer_id not in pending_offers:
        pending_offers[msg.offer_id] = {
            "offer": msg,
            "provider": sender,
            "timestamp": time.time(),
            "score": calculate_offer_score(msg)
        }
        
        # Log penawaran
        log_entry = f"Penawaran diterima: {msg.offer_id} dari {sender} - Harga: {msg.price}, Skor: {pending_offers[msg.offer_id]['score']:.2f}"
        logs_storage.append({"timestamp": time.time(), "message": log_entry})
        
        # Update network visualization
        provider_node = {"id": sender, "name": f"Provider {sender[-4:]}", "type": "provider", "reputation": msg.reputation, "price": msg.price}
        if not any(node["id"] == sender for node in network_data_storage["nodes"]):
            network_data_storage["nodes"].append(provider_node)
            network_data_storage["links"].append({"source": "requester", "target": sender})

# Fungsi untuk memulai pencarian data
async def start_data_search(ctx: Context, query_type: str, criteria: dict, max_price: float = None, min_quality: float = None):
    """Memulai pencarian data dengan mengirim query ke provider"""
    query = DataQueryMessage(
        query_type=query_type,
        criteria=criteria,
        requester_id=agent.name,
        max_price=max_price,
        min_quality=min_quality
    )
    
    # Dalam implementasi nyata, ini akan broadcast ke semua provider yang dikenal
    # Untuk demo, kita simulasikan dengan mengirim ke provider yang sudah dikenal
    known_providers = [node["id"] for node in network_data_storage["nodes"] if node["type"] == "provider"]
    
    if not known_providers:
        # Jika belum ada provider yang dikenal, simulasikan dengan menambahkan beberapa
        known_providers = ["data_provider_agent"]
    
    for provider in known_providers:
        try:
            await ctx.send(provider, query)
            ctx.logger.info(f"Query dikirim ke provider: {provider}")
        except Exception as e:
            ctx.logger.error(f"Gagal mengirim query ke {provider}: {e}")
    
    # Log pencarian
    log_entry = f"Pencarian dimulai: {query_type} dengan kriteria {criteria}"
    logs_storage.append({"timestamp": time.time(), "message": log_entry})
    
    # Update metrics
    metrics_storage["networkLatency"] = 75

# Fungsi untuk evaluasi dan pemilihan penawaran terbaik
async def evaluate_and_purchase_best_offer(ctx: Context, negotiation_id: str):
    """Evaluasi semua penawaran dan pilih yang terbaik"""
    if not pending_offers:
        ctx.logger.info("Tidak ada penawaran untuk dievaluasi")
        return
    
    # Urutkan penawaran berdasarkan skor
    sorted_offers = sorted(
        pending_offers.items(),
        key=lambda x: x[1]["score"],
        reverse=True
    )
    
    best_offer_id, best_offer_data = sorted_offers[0]
    best_offer = best_offer_data["offer"]
    provider = best_offer_data["provider"]
    
    ctx.logger.info(f"Penawaran terbaik dipilih: {best_offer_id} dari {provider} dengan skor {best_offer_data['score']:.2f}")
    
    # Generate payment hash
    payment_hash = generate_payment_hash(best_offer_id, best_offer.price)
    
    # Kirim purchase message
    purchase = PurchaseMessage(
        offer_id=best_offer_id,
        requester_id=agent.name,
        payment_hash=payment_hash
    )
    
    await ctx.send(provider, purchase)
    
    # Update active negotiations
    active_negotiations[best_offer_id] = {
        "provider": provider,
        "offer": best_offer,
        "payment_hash": payment_hash,
        "status": "purchase_sent",
        "timestamp": time.time()
    }
    
    # Hapus penawaran yang sudah diproses
    pending_offers.clear()
    
    # Log pembelian
    log_entry = f"Pembelian dikirim: {best_offer_id} ke {provider} - Harga: {best_offer.price}"
    logs_storage.append({"timestamp": time.time(), "message": log_entry})

# Handler untuk menerima data yang dibeli
@agent.on_message(model=DataDeliveryMessage)
async def handle_data_delivery(ctx: Context, sender: str, msg: DataDeliveryMessage):
    ctx.logger.info(f"Data diterima dari {sender}: {msg.transaction_id}")
    
    # Verifikasi data
    try:
        data_payload = json.loads(msg.data_payload)
        verification_hash = hashlib.sha256(json.dumps(data_payload, sort_keys=True).encode()).hexdigest()
        
        data_verified = verification_hash == msg.verification_hash
        
        if data_verified:
            ctx.logger.info(f"Data terverifikasi untuk transaksi {msg.transaction_id}")
            transaction_status = "success"
            quality_rating = 8.5  # Simulasi rating kualitas
        else:
            ctx.logger.error(f"Data tidak terverifikasi untuk transaksi {msg.transaction_id}")
            transaction_status = "failure"
            quality_rating = 0.0
        
        # Cari informasi transaksi
        offer_info = None
        for offer_id, negotiation in active_negotiations.items():
            if negotiation["provider"] == sender:
                offer_info = negotiation
                break
        
        if offer_info:
            # Kirim log transaksi ke reputation agent
            transaction_log = TransactionLogMessage(
                transaction_id=msg.transaction_id,
                provider_id=sender,
                requester_id=agent.name,
                status=transaction_status,
                data_hash_verified=data_verified,
                price=offer_info["offer"].price,
                quality_rating=quality_rating
            )
            
            await ctx.send(reputation_agent_address, transaction_log)
            
            # Update transaction history
            transaction_history.append({
                "transaction_id": msg.transaction_id,
                "provider": sender,
                "price": offer_info["offer"].price,
                "status": transaction_status,
                "timestamp": time.time(),
                "data_verified": data_verified
            })
            
            # Update metrics
            metrics_storage["totalTransactions"] += 1
            if metrics_storage["totalTransactions"] > 0:
                total_price = sum(t["price"] for t in transaction_history)
                metrics_storage["averagePricePerDataUnit"] = total_price / metrics_storage["totalTransactions"]
            
            # Log transaksi selesai
            log_entry = f"Transaksi selesai: {msg.transaction_id} - Status: {transaction_status}"
            logs_storage.append({"timestamp": time.time(), "message": log_entry})
            
    except Exception as e:
        ctx.logger.error(f"Error memproses data delivery: {e}")

# Query handlers untuk frontend
@agent.on_query(model=LogQueryMessage)
async def get_logs(ctx: Context, sender: str, query: LogQueryMessage):
    return logs_storage

@agent.on_query(model=MetricQueryMessage)
async def get_metrics(ctx: Context, sender: str, query: MetricQueryMessage):
    return metrics_storage

@agent.on_query(model=NetworkQueryMessage)
async def get_network_data(ctx: Context, sender: str, query: NetworkQueryMessage):
    return network_data_storage

# Fungsi untuk memulai pencarian (dipanggil dari frontend)
@agent.on_message(model=LogMessage)
async def handle_search_request(ctx: Context, sender: str, msg: LogMessage):
    """Handler untuk memulai pencarian data dari frontend"""
    if "start_search" in msg.log_entry:
        # Simulasi pencarian data suhu Jakarta
        await start_data_search(
            ctx,
            query_type="suhu",
            criteria={"location": "Jakarta", "year": 2024},
            max_price=200.0,
            min_quality=7.0
        )
        
        # Tunggu beberapa detik untuk mengumpulkan penawaran
        await asyncio.sleep(3)
        
        # Evaluasi dan beli penawaran terbaik
        await evaluate_and_purchase_best_offer(ctx, "search_001")
    
    return "Pencarian dimulai."

if __name__ == "__main__":
    import asyncio
    agent.run()
