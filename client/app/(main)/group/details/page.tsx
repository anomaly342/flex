import { Suspense } from "react";
import GroupDetail from "./GroupDetail";

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<GroupDetail />
		</Suspense>
	);
}
