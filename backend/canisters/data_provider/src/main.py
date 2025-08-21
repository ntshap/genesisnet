from uagents import Agent, Context, Model

# Definisikan model pesan
class DataQueryMessage(Model):
    query_type: str
    criteria: dict

class DataOfferMessage(Model):
    provider_id: str
    price: float
    data_hash: str
    reputation: float

agent = Agent(name="data_provider_agent", seed="data_provider_seed")

# Inventaris data yang disediakan oleh provider ini
provider_data_inventory = {
    "suhu_jakarta_2024": {"price": 120, "data_hash": "hash_suhu_jakarta_2024_abc", "quality": 9},
    "kelembaban_bandung_2023": {"price": 90, "data_hash": "hash_kelembaban_bandung_2023_xyz", "quality": 7}
}

# Handler yang mendengarkan permintaan
@agent.on_message(model=DataQueryMessage)
async def handle_query(ctx: Context, sender: str, msg: DataQueryMessage):
    ctx.logger.info(f"Permintaan data diterima dari {sender}: {msg.criteria}")
    
    # Logika sederhana untuk merespons permintaan
    if msg.query_type == "suhu" and msg.criteria.get("location") == "Jakarta":
        offer = DataOfferMessage(
            provider_id=agent.name,
            price=provider_data_inventory["suhu_jakarta_2024"]["price"],
            data_hash=provider_data_inventory["suhu_jakarta_2024"]["data_hash"],
            reputation=provider_data_inventory["suhu_jakarta_2024"]["quality"]
        )
        await ctx.send(sender, offer)
        ctx.logger.info(f"Menawarkan data suhu Jakarta ke {sender}")
    else:
        await ctx.send(sender, "Tidak ada data yang cocok.")

if __name__ == "__main__":
    agent.run()
