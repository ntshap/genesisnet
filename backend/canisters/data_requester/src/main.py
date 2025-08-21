from uagents import Agent, Context, Model
import json

# Definisikan model pesan
class DataQueryMessage(Model):
    query_type: str
    criteria: dict

class DataOfferMessage(Model):
    provider_id: str
    price: float
    data_hash: str
    reputation: float

class PurchaseMessage(Model):
    offer_id: str
    requester_id: str

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

# Penyimpanan data sementara
logs_storage = []
metrics_storage = {"totalTransactions": 0, "averagePricePerDataUnit": 0.0, "networkLatency": 0}
network_data_storage = {
    "nodes": [{"id": "requester", "name": "Data Requester Agent", "type": "requester"}],
    "links": []
}

# Fungsi yang dipanggil oleh frontend untuk memulai pencarian
@agent.on_query(model=DataQueryMessage)
async def start_search(ctx: Context, sender: str, query: DataQueryMessage):
    ctx.logger.info(f"Permintaan pencarian diterima: {query.criteria}")
    logs_storage.append(f"[{ctx.timestamp}] Permintaan pencarian diterima: {json.dumps(query.criteria)}")
    
    # Logika negosiasi akan diimplementasikan di sini
    # Untuk demo, kita simulasikan penambahan data
    metrics_storage["totalTransactions"] += 1
    metrics_storage["averagePricePerDataUnit"] = (metrics_storage["averagePricePerDataUnit"] * (metrics_storage["totalTransactions"] - 1) + 100) / metrics_storage["totalTransactions"]
    metrics_storage["networkLatency"] = 75
    
    if len(network_data_storage["nodes"]) < 5:
        new_provider_id = f"provider{len(network_data_storage['nodes'])}"
        network_data_storage["nodes"].append({"id": new_provider_id, "name": f"Provider {chr(65 + len(network_data_storage['nodes']) - 1)}", "type": "provider", "reputation": 8, "price": 100})
        network_data_storage["links"].append({"source": "requester", "target": new_provider_id})

    return "Pencarian dimulai."

# Fungsi untuk mendapatkan log
@agent.on_query(model=LogQueryMessage)
async def get_logs(ctx: Context, sender: str, query: LogQueryMessage):
    return logs_storage

# Fungsi untuk mendapatkan metrik
@agent.on_query(model=MetricQueryMessage)
async def get_metrics(ctx: Context, sender: str, query: MetricQueryMessage):
    return metrics_storage

# Fungsi untuk mendapatkan data jaringan
@agent.on_query(model=NetworkQueryMessage)
async def get_network_data(ctx: Context, sender: str, query: NetworkQueryMessage):
    return network_data_storage

if __name__ == "__main__":
    agent.run()
