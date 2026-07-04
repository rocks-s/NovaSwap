from bip_utils import Bip39SeedGenerator, Bip44, Bip44Coins, Bip44Changes
import os


mnemonic = os.getenv("EVM_SEED_PHRASE")

# mnemonic → seed
seed = Bip39SeedGenerator(mnemonic).Generate()

# seed → HD wallet 
bip44_ctx = Bip44.FromSeed(seed, Bip44Coins.ETHEREUM)

# 4billion addresses from index 0

def generate_evm_address(addr_index):
    
    addr = (bip44_ctx
            .Purpose()
            .Coin()
            .Account(0)
            .Change(Bip44Changes.CHAIN_EXT)
            .AddressIndex(addr_index)
            .PublicKey()
            .ToAddress())
    return addr