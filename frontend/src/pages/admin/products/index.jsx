import { useState } from 'react'
import ProductModal from "../../../components/base/ProductModal"
import {Button} from "../../../components/ui/button"
import ProductTable from '../../../components/base/ProductTable';
const Product = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>

<Button onClick={() => setIsModalOpen(true)}>Upload Product</Button>
<ProductModal open={isModalOpen} setOpen={setIsModalOpen} />
<ProductTable/>
    </div>
  )
}

export default Product