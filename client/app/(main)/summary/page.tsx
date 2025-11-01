import { Suspense } from "react";
import OrderSummary from "./Summary";

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<OrderSummary />
		</Suspense>
	);
}
