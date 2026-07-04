import logging
from web3 import Web3


logging.basicConfig(
    filename='logs/transfer_checkers/evm.log',
    level=logging.ERROR,#INFO,
    format='%(asctime)s %(levelname)s %(message)s'
)


erc20_abi = [
        {
            "constant": True,
            "inputs": [{"name": "_owner", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"name": "balance", "type": "uint256"}],
            "type": "function",
        },
        {
            "constant": True,
            "inputs": [],
            "name": "decimals",
            "outputs": [{"name": "", "type": "uint8"}],
            "type": "function",
        }
    ]


networks_data = {
    'Arbitrum': {'RPC_URL': "https://arb1.arbitrum.io/rpc",
                 
                'TOKEN_ADDRESSES': {
                    'USDT':"0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                    'ARBITRUM': "0x912CE59144191C1204E64559FE8253a0e49E6548"
                    } 
                },
    'Polygon': {'RPC_URL': "https://polygon.drpc.org/",
                
                'TOKEN_ADDRESSES': {
                    'USDT':"0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
                    }
                },
    'OP': {'RPC_URL': "https://optimism-rpc.publicnode.com",
           
            'TOKEN_ADDRESSES': {
                'USDT':"0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
                }
            },
    'BSC': {'RPC_URL': "https://bsc-rpc.publicnode.com",
               
            'TOKEN_ADDRESSES': {
                'USDT':"0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
                }
            },
    'Ethereum': {'RPC_URL': "https://ethereum-rpc.publicnode.com", 
                 
                'TOKEN_ADDRESSES': {
                    'USDT':"0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
                    }
                }
}


def get_evm_balance(network, token, address):
    if not networks_data.get(network):
        return {
            "data": None,
            "error": "The network is not supported for checking"
        }
    
    rpc_url = networks_data[network]['RPC_URL']
    token_address = networks_data[network]['TOKEN_ADDRESSES'][token]

    try:
        w3 = Web3(Web3.HTTPProvider(rpc_url)) 
    except Exception:
        logging.exception("Failed to connect to the network RPC")
        return {
            "data": None,
            "error": f"Failed to connect to the network RPC"
        } 
    try:
        contract = w3.eth.contract(
            address=Web3.to_checksum_address(token_address),
            abi=erc20_abi
        )

        balance = contract.functions.balanceOf(
            Web3.to_checksum_address(address)
        ).call()

        decimals = contract.functions.decimals().call()
    except Exception:
        logging.exception("Failed to get balance from blockchain")
        return {
            "data": None,
            "error": f"Failed to get balance from blockchain"
        } 

    return {
            "data": balance / 10**decimals,
            "error": None
        } 


def evm_transfer_check(network, token, address, send_amount, last_balance):

    transfer = get_evm_balance(network, token, address)
    balance, error = transfer.values()

    answer = {"received": None,
              "error": None}

    if error:
        answer["error"] = error
    elif balance <= last_balance:
        answer['received'] = False
        answer["error"] = 'transfer not found'
    elif balance - last_balance < send_amount:
        answer['received'] = False
        answer["error"] = 'amount less than subscription price'
    else:
        answer['received'] = True
    return answer
  