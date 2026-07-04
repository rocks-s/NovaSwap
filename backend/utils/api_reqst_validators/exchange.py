required_params = [
    'sendAmount', 'getAmount', 'sendCoin', 'getCoin',
    'sendNetwork', 'getNetwork', 'recAddress'
    ]

def exchange_validator(data):

    # params check

    data_params = data.keys()
    data_params.sort()
    required_params.sort()
    if data_params != required_params:
        return {'error': 'params isnt match required'}
    
    # if data['recAddress'] 
    return True
    
    
    
