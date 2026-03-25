import { useEffect, useState } from "react";
import {
    getVariantsByProduct,
    deleteVariant
} from "../../../services/variantService";

import VariantFormModal from "../../../components/VarientFormModel";
import StockModal from "../../../components/StockModel";

const AdminVariants = ({ productId }) => {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openForm, setOpenForm] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);

    const [openStock, setOpenStock] = useState(false);

    const fetchVariants = async () => {
        try {
            setLoading(true);
            const { data } = await getVariantsByProduct(productId);
            setVariants(data.variants);
        } catch (err) {
            console.error(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) fetchVariants();
    }, [productId]);

    const handleDelete = async (id) => {
        if (!confirm("Delete this variant?")) return;

        try {
            await deleteVariant(id);
            fetchVariants();
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    return (
  <div className="bg-white border rounded-2xl shadow-sm p-4">

    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Variants
        </h2>
        <p className="text-xs text-gray-500">
          Manage product variants
        </p>
      </div>

      <button
        onClick={() => {
          setSelectedVariant(null);
          setOpenForm(true);
        }}
        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm transition"
      >
        + Add Variant
      </button>
    </div>

    {/* Content */}
    {loading ? (
      <div className="py-10 text-center text-gray-500">
        Loading...
      </div>
    ) : variants.length === 0 ? (
      <div className="py-10 text-center text-gray-500">
        No variants found
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* Head */}
          <thead className="bg-gray-50 text-gray-600">
            <tr className="text-left">
              <th className="px-4 py-3">Attributes</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y">
            {variants.map((v) => (
              <tr key={v._id} className="hover:bg-gray-50 transition">

                {/* Attributes */}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {v.attributes.map((a, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-700"
                      >
                        {a.attribute?.name}: {a.value}
                      </span>
                    ))}
                  </div>
                </td>

                {/* SKU */}
                <td className="px-4 py-3 text-gray-600">
                  {v.sku || "-"}
                </td>

                {/* Price */}
                <td className="px-4 py-3 font-medium text-gray-800">
                  ₹ {v.discountPrice || v.price}
                </td>

                {/* Stock */}
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    v.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {v.stock}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right space-x-3">

                  <button
                    onClick={() => {
                      setSelectedVariant(v);
                      setOpenForm(true);
                    }}
                    className="text-gray-600 hover:text-green-700 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(v._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => {
                      setSelectedVariant(v);
                      setOpenStock(true);
                    }}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Stock
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* Modals */}
    {openForm && (
      <VariantFormModal
        productId={productId}
        variant={selectedVariant}
        onClose={() => setOpenForm(false)}
        refresh={fetchVariants}
      />
    )}

    {openStock && (
      <StockModal
        variant={selectedVariant}
        onClose={() => setOpenStock(false)}
        refresh={fetchVariants}
      />
    )}
  </div>
);
};

export default AdminVariants;