import Link from "next/link";
import Button from "@/components/Button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 px-4 text-center">
            <h1 className="text-8xl font-rowdies text-primary mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Page Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-md">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link href="/">
                <Button
                    type="button"
                    title="Return Home"
                    className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-green-700 transition"
                />
            </Link>
        </div>
    );
}
