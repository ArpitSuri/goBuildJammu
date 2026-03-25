import { useEffect, useState } from "react";
import { getDelivery, deleteDelivery } from "../../services/deliveryService";
import DeliveryModal from "../../components/DeliveryModel";

export default function DeliveryPage() {
    const [deliveryList, setDeliveryList] = useState([]);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const fetchData = async () => {
        const { data } = await getDelivery();
        setDeliveryList(data.delivery);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete delivery person?")) return;
        await deleteDelivery(id);
        fetchData();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Delivery Team</h1>
                <button onClick={() => setOpen(true)} className="btn">
                    Add Delivery
                </button>
            </div>

            <table className="w-full border">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Vehicle</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {deliveryList.map((d) => (
                        <tr key={d._id}>
                            <td>{d.user?.name}</td>
                            <td>{d.user?.email}</td>
                            <td>{d.vehicleType}</td>
                            <td>
                                {d.isAvailable ? "Available" : "Busy"}
                            </td>
                            <td>
                                <button onClick={() => {
                                    setEditData(d);
                                    setOpen(true);
                                }}>
                                    Edit
                                </button>

                                <button onClick={() => handleDelete(d._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <DeliveryModal
                isOpen={open}
                onClose={() => setOpen(false)}
                refresh={fetchData}
                editData={editData}
            />
        </div>
    );
}