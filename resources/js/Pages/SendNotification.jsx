import { useState } from "react";
import { router, usePage } from "@inertiajs/react";

export default function SendNotification() {
    const { users, flash } = usePage().props;

    const [formData, setFormData] = useState({
        userId: "",
        message: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post("/notify-user", formData, {
            onSuccess: () => {
                alert("Notification sent successfully!");
                setFormData({ userId: "", message: "" });
            }
        });
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Send Auth Notification</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block font-semibold">Select User</label>
                    <select
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">-- Choose User --</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold">Message</label>
                    <textarea
                        className="w-full p-2 border rounded"
                        rows="4"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Send Notification
                </button>
            </form>
        </div>
    );
}
