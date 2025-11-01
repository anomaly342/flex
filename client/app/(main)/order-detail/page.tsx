import { Suspense } from "react";
import OrderDetails from "./OrderDetail";

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<OrderDetails />
		</Suspense>
	);
}
