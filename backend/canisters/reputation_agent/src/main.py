from uagents import Agent, Context, Model

# Definisikan model pesan untuk log transaksi
class TransactionLogMessage(Model):
    transaction_id: str
    provider_id: str
    status: str
    data_hash_verified: bool

agent = Agent(name="reputation_agent", seed="reputation_agent_seed")

# Penyimpanan reputasi sementara
reputation_scores = {}

# Handler yang mendengarkan log transaksi
@agent.on_message(model=TransactionLogMessage)
async def handle_transaction_log(ctx: Context, sender: str, msg: TransactionLogMessage):
    ctx.logger.info(f"Log transaksi diterima dari {sender}: {msg.transaction_id}, Status: {msg.status}")
    
    provider_id = msg.provider_id
    current_reputation = reputation_scores.get(provider_id, 5)
    
    if msg.status == "success" and msg.data_hash_verified:
        reputation_scores[provider_id] = min(10, current_reputation + 1)
    elif msg.status == "failure" or not msg.data_hash_verified:
        reputation_scores[provider_id] = max(1, current_reputation - 1)
    
    # Di implementasi nyata, ini akan memanggil update di canister ICP
    # untuk menyimpan reputasi secara persisten.

if __name__ == "__main__":
    agent.run()
