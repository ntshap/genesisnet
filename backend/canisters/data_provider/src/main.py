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

agent = Agent(name="data_provider_agent", seed="data_provider_seed")

# Inventaris data yang lebih lengkap
provider_data_inventory = {
    "suhu_jakarta_2024": {
        "price": 120, 
        "data_hash": "hash_suhu_jakarta_2024_abc", 
        "quality": 9.2,
        "size": 1024,
        "location": "Jakarta",
        "type": "suhu",
        "year": 2024,
        "availability": "available"
    },
    "kelembaban_bandung_2023": {
        "price": 90, 
        "data_hash": "hash_kelembaban_bandung_2023_xyz", 
        "quality": 7.8,
        "size": 512,
        "location": "Bandung",
        "type": "kelembaban",
        "year": 2023,
        "availability": "available"
    },
    "cuaca_surabaya_2024": {
        "price": 150,
        "data_hash": "hash_cuaca_surabaya_2024_def",
        "quality": 8.5,
        "size": 2048,
        "location": "Surabaya",
        "type": "cuaca",
        "year": 2024,
        "availability": "available"
    }
}

# Reputasi provider saat ini
provider_reputation = 8.7
active_offers = {}
transaction_history = []

def find_matching_data(query_type: str, criteria: dict) -> List[str]:
    """Mencari data yang cocok dengan kriteria permintaan"""
    matching_data = []
    
    for data_id, data_info in provider_data_inventory.items():
        # Cek tipe data
        if data_info["type"] != query_type:
            continue
            
        # Cek lokasi jika ada
        if "location" in criteria and data_info["location"].lower() != criteria["location"].lower():
            continue
            
        # Cek tahun jika ada
        if "year" in criteria and data_info["year"] != criteria["year"]:
            continue
            
        # Cek ketersediaan
        if data_info["availability"] == "available":
            matching_data.append(data_id)
    
    return matching_data

def generate_offer_id() -> str:
    """Generate unique offer ID"""
    return hashlib.md5(f"{agent.name}_{time.time()}".encode()).hexdigest()[:12]

# Handler untuk permintaan data
@agent.on_message(model=DataQueryMessage)
async def handle_data_query(ctx: Context, sender: str, msg: DataQueryMessage):
    ctx.logger.info(f"Permintaan data diterima dari {sender}: {msg.query_type} dengan kriteria {msg.criteria}")
    
    # Cari data yang cocok
    matching_data = find_matching_data(msg.query_type, msg.criteria)
    
    if not matching_data:
        ctx.logger.info(f"Tidak ada data yang cocok untuk permintaan dari {sender}")
        return
    
    # Buat penawaran untuk setiap data yang cocok
    for data_id in matching_data:
        data_info = provider_data_inventory[data_id]
        
        # Cek filter harga dan kualitas
        if msg.max_price and data_info["price"] > msg.max_price:
            continue
        if msg.min_quality and data_info["quality"] < msg.min_quality:
            continue
        
        # Generate offer
        offer_id = generate_offer_id()
        offer = DataOfferMessage(
            provider_id=agent.name,
            price=data_info["price"],
            data_hash=data_info["data_hash"],
            reputation=provider_reputation,
            data_size=data_info["size"],
            quality_score=data_info["quality"],
            availability=data_info["availability"],
            offer_id=offer_id
        )
        
        # Simpan penawaran aktif
        active_offers[offer_id] = {
            "data_id": data_id,
            "requester": sender,
            "timestamp": time.time(),
            "status": "pending"
        }
        
        await ctx.send(sender, offer)
        ctx.logger.info(f"Mengirim penawaran {offer_id} untuk data {data_id} ke {sender}")

# Handler untuk pembelian
@agent.on_message(model=PurchaseMessage)
async def handle_purchase(ctx: Context, sender: str, msg: PurchaseMessage):
    ctx.logger.info(f"Permintaan pembelian diterima dari {sender} untuk offer {msg.offer_id}")
    
    if msg.offer_id not in active_offers:
        ctx.logger.error(f"Offer {msg.offer_id} tidak ditemukan atau sudah expired")
        return
    
    offer_info = active_offers[msg.offer_id]
    
    # Verifikasi requester
    if offer_info["requester"] != sender:
        ctx.logger.error(f"Unauthorized purchase attempt from {sender}")
        return
    
    # Simulasi verifikasi pembayaran
    if not msg.payment_hash:
        ctx.logger.error(f"Payment hash tidak valid dari {sender}")
        return
    
    # Update status offer
    active_offers[msg.offer_id]["status"] = "sold"
    
    # Simulasi pengiriman data
    data_id = offer_info["data_id"]
    data_info = provider_data_inventory[data_id]
    
    # Generate transaction ID
    transaction_id = hashlib.md5(f"{msg.offer_id}_{time.time()}".encode()).hexdigest()
    
    # Simulasi data payload (dalam implementasi nyata, ini akan berisi data sebenarnya)
    simulated_data = {
        "data_type": data_info["type"],
        "location": data_info["location"],
        "timestamp": time.time(),
        "values": [25.5, 26.1, 24.8, 27.2, 25.9]  # Data simulasi
    }
    
    # Generate verification hash
    verification_hash = hashlib.sha256(json.dumps(simulated_data, sort_keys=True).encode()).hexdigest()
    
    delivery = DataDeliveryMessage(
        transaction_id=transaction_id,
        data_payload=json.dumps(simulated_data),
        verification_hash=verification_hash
    )
    
    await ctx.send(sender, delivery)
    
    # Catat transaksi
    transaction_history.append({
        "transaction_id": transaction_id,
        "offer_id": msg.offer_id,
        "requester": sender,
        "data_id": data_id,
        "price": data_info["price"],
        "timestamp": time.time(),
        "status": "completed"
    })
    
    ctx.logger.info(f"Data berhasil dikirim ke {sender} dengan transaction ID {transaction_id}")

if __name__ == "__main__":
    agent.run()
