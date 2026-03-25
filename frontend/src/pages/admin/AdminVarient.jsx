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
        <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Variants</h2>

                <button
                    onClick={() => {
                        setSelectedVariant(null);
                        setOpenForm(true);
                    }}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    + Add Variant
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : variants.length === 0 ? (
                <p>No variants found</p>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2">Attributes</th>
                            <th className="p-2">SKU</th>
                            <th className="p-2">Price</th>
                            <th className="p-2">Stock</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {variants.map((v) => (
                            <tr key={v._id} className="border-t">
                                <td className="p-2">
                                    {v.attributes.map((a, i) => (
                                        <span key={i} className="mr-2 text-sm">
                                            {a.attribute?.name}: {a.value}
                                        </span>
                                    ))}
                                </td>

                                <td className="p-2">{v.sku || "-"}</td>

                                <td className="p-2">
                                    ₹{v.discountPrice || v.price}
                                </td>

                                <td className="p-2">{v.stock}</td>

                                <td className="p-2 space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedVariant(v);
                                            setOpenForm(true);
                                        }}
                                        className="text-blue-600"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(v._id)}
                                        className="text-red-600"
                                    >
                                        Delete
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedVariant(v);
                                            setOpenStock(true);
                                        }}
                                        className="text-green-600"
                                    >
                                        Stock
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

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