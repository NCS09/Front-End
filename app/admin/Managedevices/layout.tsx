import Sidebar from "../../components/auth/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8">
                {children}
            </main>
        </section>
    );
}
