"""Initial migration

Revision ID: f36bd0e449d6
Revises:
Create Date: 2025-08-21 23:01:11.891941

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f36bd0e449d6"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table("users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(length=50), nullable=False),
        sa.Column("username", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=100), nullable=False),
        sa.Column("full_name", sa.String(length=100), nullable=True),
        sa.Column("wallet_address", sa.String(length=100), nullable=True),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.Column("status", sa.Enum("active", "inactive", "suspended", name="userstatus"), nullable=True),
        sa.Column("reputation_score", sa.Float(), nullable=True),
        sa.Column("total_data_provided", sa.Integer(), nullable=True),
        sa.Column("total_data_requested", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("user_id"),
        sa.UniqueConstraint("username")
    )
    
    # Create data_requests table
    op.create_table("data_requests",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("request_id", sa.String(length=50), nullable=False),
        sa.Column("requester_id", sa.Integer(), nullable=False),
        sa.Column("data_type", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("reward_amount", sa.Float(), nullable=False),
        sa.Column("status", sa.Enum("pending", "active", "completed", "cancelled", "expired", name="requeststatus"), nullable=True),
        sa.Column("deadline", sa.DateTime(), nullable=True),
        sa.Column("requirements", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["requester_id"], ["users.id"], ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("request_id")
    )
    
    # Create data_provisions table
    op.create_table("data_provisions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("provision_id", sa.String(length=50), nullable=False),
        sa.Column("request_id", sa.String(length=50), nullable=False),
        sa.Column("provider_id", sa.Integer(), nullable=False),
        sa.Column("data_content", sa.Text(), nullable=False),
        sa.Column("metadata", sa.JSON(), nullable=True),
        sa.Column("status", sa.Enum("pending", "accepted", "rejected", name="provisionstatus"), nullable=True),
        sa.Column("quality_score", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("accepted_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["provider_id"], ["users.id"], ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("provision_id")
    )
    
    # Create transactions table
    op.create_table("transactions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("transaction_id", sa.String(length=50), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("request_id", sa.String(length=50), nullable=True),
        sa.Column("transaction_type", sa.Enum("payment", "reward", "fee", "refund", name="transactiontype"), nullable=False),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("status", sa.Enum("pending", "completed", "failed", "cancelled", name="transactionstatus"), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("metadata", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("transaction_id")
    )
    
    # Create network_nodes table
    op.create_table("network_nodes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("node_id", sa.String(length=50), nullable=False),
        sa.Column("node_address", sa.String(length=100), nullable=False),
        sa.Column("node_type", sa.String(length=50), nullable=True),
        sa.Column("status", sa.Enum("active", "inactive", "maintenance", name="nodestatus"), nullable=True),
        sa.Column("location", sa.String(length=100), nullable=True),
        sa.Column("capabilities", sa.JSON(), nullable=True),
        sa.Column("last_seen", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("node_address"),
        sa.UniqueConstraint("node_id")
    )
    
    # Create network_metrics table
    op.create_table("network_metrics",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("metric_id", sa.String(length=50), nullable=False),
        sa.Column("node_id", sa.String(length=50), nullable=False),
        sa.Column("cpu_usage", sa.Float(), nullable=True),
        sa.Column("memory_usage", sa.Float(), nullable=True),
        sa.Column("network_latency", sa.Float(), nullable=True),
        sa.Column("throughput", sa.Float(), nullable=True),
        sa.Column("uptime", sa.Float(), nullable=True),
        sa.Column("response_time", sa.Float(), nullable=True),
        sa.Column("timestamp", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["node_id"], ["network_nodes.node_id"], ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("metric_id")
    )
    
    # Create reputation_history table
    op.create_table("reputation_history",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("history_id", sa.String(length=50), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("action_type", sa.String(length=50), nullable=False),
        sa.Column("score_change", sa.Float(), nullable=False),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("metadata", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("history_id")
    )


def downgrade() -> None:
    op.drop_table("reputation_history")
    op.drop_table("network_metrics")
    op.drop_table("network_nodes")
    op.drop_table("transactions")
    op.drop_table("data_provisions")
    op.drop_table("data_requests")
    op.drop_table("users")
