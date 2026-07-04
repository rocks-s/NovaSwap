import os
from services.user_addrs_controls.evm import generate_evm_address


network_addr_gens = {
    "ETH": generate_evm_address
}

base_addr_index = int(os.getenv("EVM_gen_addr_index"))


def generate_address(index, network):
    index += base_addr_index
    return network_addr_gens[network](index)
    