import { Suspense } from "react";
import ZoneDetail from "./IndividualDetail";

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ZoneDetail />
		</Suspense>
	);
}
