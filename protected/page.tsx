// app/protected/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
	const session = await getServerSession();

	if (!session) {
		redirect("/login");
	}

	// Your protected page content
	return (
		<div>
			<h1>Protected Content</h1>
			<p>Welcome {session.user?.name}</p>
		</div>
	);
}
