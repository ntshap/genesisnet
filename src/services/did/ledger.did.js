// ledger.did.js
// IDL (Interface Definition Language) for the ICP Ledger canister

export const idlFactory = ({ IDL }) => {
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const Duration = IDL.Record({ 'secs' : IDL.Nat64, 'nanos' : IDL.Nat32 });
  const ArchiveOptions = IDL.Record({
    'num_blocks_to_archive' : IDL.Nat64,
    'trigger_threshold' : IDL.Nat64,
    'max_message_size_bytes' : IDL.Opt(IDL.Nat64),
    'cycles_for_archive_creation' : IDL.Opt(IDL.Nat64),
    'node_max_memory_size_bytes' : IDL.Opt(IDL.Nat64),
    'controller_id' : IDL.Principal,
  });
  const ICPTs = IDL.Record({ 'e8s' : IDL.Nat64 });
  const LedgerCanisterInitPayload = IDL.Record({
    'send_whitelist' : IDL.Vec(IDL.Principal),
    'token_symbol' : IDL.Opt(IDL.Text),
    'transfer_fee' : IDL.Opt(ICPTs),
    'minting_account' : AccountIdentifier,
    'transaction_window' : IDL.Opt(Duration),
    'max_message_size_bytes' : IDL.Opt(IDL.Nat64),
    'archive_options' : IDL.Opt(ArchiveOptions),
    'initial_values' : IDL.Vec(IDL.Tuple(AccountIdentifier, ICPTs)),
    'token_name' : IDL.Opt(IDL.Text),
  });
  const Timestamp = IDL.Record({ 'timestamp_nanos' : IDL.Nat64 });
  const Memo = IDL.Nat64;
  const SubAccount = IDL.Vec(IDL.Nat8);
  const BlockIndex = IDL.Nat64;
  const TransferError = IDL.Variant({
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
    'BadFee' : IDL.Record({ 'expected_fee' : ICPTs }),
    'TxDuplicate' : IDL.Record({ 'duplicate_of' : BlockIndex }),
    'TxCreatedInFuture' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : ICPTs }),
  });
  const TransferResult = IDL.Variant({
    'Ok' : BlockIndex,
    'Err' : TransferError,
  });
  const TransferArgs = IDL.Record({
    'to' : AccountIdentifier,
    'fee' : ICPTs,
    'memo' : Memo,
    'from_subaccount' : IDL.Opt(SubAccount),
    'created_at_time' : IDL.Opt(Timestamp),
    'amount' : ICPTs,
  });
  const AccountBalanceArgs = IDL.Record({
    'account' : AccountIdentifier,
  });
  const NotifyCanisterArgs = IDL.Record({
    'to_subaccount' : IDL.Opt(SubAccount),
    'from_subaccount' : IDL.Opt(SubAccount),
    'to_canister' : IDL.Principal,
    'max_fee' : ICPTs,
    'block_height' : BlockIndex,
  });
  const Ledger = IDL.Service({
    'account_balance' : IDL.Func([AccountBalanceArgs], [ICPTs], ['query']),
    'notify_dfx' : IDL.Func([NotifyCanisterArgs], [], []),
    'transfer' : IDL.Func([TransferArgs], [TransferResult], []),
    'transfer_fee' : IDL.Func([], [ICPTs], ['query']),
  });
  return Ledger;
};

export const init = ({ IDL }) => {
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const Duration = IDL.Record({ 'secs' : IDL.Nat64, 'nanos' : IDL.Nat32 });
  const ArchiveOptions = IDL.Record({
    'num_blocks_to_archive' : IDL.Nat64,
    'trigger_threshold' : IDL.Nat64,
    'max_message_size_bytes' : IDL.Opt(IDL.Nat64),
    'cycles_for_archive_creation' : IDL.Opt(IDL.Nat64),
    'node_max_memory_size_bytes' : IDL.Opt(IDL.Nat64),
    'controller_id' : IDL.Principal,
  });
  const ICPTs = IDL.Record({ 'e8s' : IDL.Nat64 });
  const LedgerCanisterInitPayload = IDL.Record({
    'send_whitelist' : IDL.Vec(IDL.Principal),
    'token_symbol' : IDL.Opt(IDL.Text),
    'transfer_fee' : IDL.Opt(ICPTs),
    'minting_account' : AccountIdentifier,
    'transaction_window' : IDL.Opt(Duration),
    'max_message_size_bytes' : IDL.Opt(IDL.Nat64),
    'archive_options' : IDL.Opt(ArchiveOptions),
    'initial_values' : IDL.Vec(IDL.Tuple(AccountIdentifier, ICPTs)),
    'token_name' : IDL.Opt(IDL.Text),
  });
  return [LedgerCanisterInitPayload];
};
