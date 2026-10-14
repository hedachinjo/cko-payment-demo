
import PaymentForm from "./components/PaymentForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-2 text-3xl font-bold">
          Checkout.com Payment Demo
        </h1>

        <p className="mb-8 text-gray-600">
          Next.js + Checkout.com Flow Sandbox
        </p>

        <div className="mb-6 rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">
            Demo Product
          </h2>

          <p className="mt-2 text-gray-600">
            Checkout.com Integration Test
          </p>

          <p className="mt-4 text-2xl font-bold">
            $25.00 USD
          </p>
        </div>

        <div className="bg-white">
          <PaymentForm />
        </div>
      </div>
    </main>
  );
}
