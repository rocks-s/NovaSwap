import {useMovieContext} from "../contexts/MovieContext"

function Orders() {
  const {orders} = useMovieContext()

  return (
    <div>{orders}</div>
  )

}

export default Orders