import { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct } from "../../../services/productService";
import { getCategories } from "../../../services/categoryService";
import { getAttributes } from "../../../services/attributeServie";

import ProductFormModal from "../../../components/ProductFormModal";
import ProductList from "../../../components/ProductList";
import AdminVariants from "./AdminVarient";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchAll = async () => {
        const p = await getProducts();
        const c = await getCategories();
        const a = await getAttributes();

        setProducts(p.data.products);
        setCategories(c.data.categories);
        setAttributes(a.data.attributes);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleCreate = async (data) => {
        await createProduct(data);
        fetchAll();
    };

    const handleDelete = async (id) => {
        await deleteProduct(id);
        fetchAll();
    };

    return (
  <div className="p-6 bg-gray-100 min-h-screen">

    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Products
        </h1>
        <p className="text-sm text-gray-500">
          Manage your product catalog
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow-sm transition"
      >
        + Add Product
      </button>
    </div>

    {/* Content Card */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-sm">
            No products found
          </p>
        </div>
      ) : (<>
              <ProductList
                products={products}
                onDelete={handleDelete}
                onSelect={setSelectedProduct} // 🔥 ADD THIS
              />
              {/* VARIANTS SECTION */}
              {selectedProduct && (
                <div className="mt-6 border-t pt-6">
                  <h2 className="text-lg font-semibold mb-3">
                    Variants for {selectedProduct.name}
                  </h2>

                  <AdminVariants productId={selectedProduct._id} />
                </div>
              )}

              </>
              
      )}
    </div>

    {/* Modal */}
    <ProductFormModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onSubmit={handleCreate}
      categories={categories}
      attributes={attributes}
    />
  </div>
);
}