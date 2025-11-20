import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

export default function Dashboard() {
    const { props } = usePage();
    const user = props.auth.user;

    useEffect(() => {
        window.Pusher = Pusher;

        window.Echo = new Echo({
            broadcaster: "pusher",
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true,
            authEndpoint: "/broadcasting/auth",
        });

        window.Echo.private(`user.${user.id}`)
            .listen(".auth.notification", (e) => {
                alert(`🔔 New notification: ${e.message}`);
            });
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
