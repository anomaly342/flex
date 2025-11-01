import { Suspense } from "react";
import PaySuccessful from "./Success";

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PaySuccessful />
		</Suspense>
	);
}
