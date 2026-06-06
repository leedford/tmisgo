export default function UsersPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FF4D00]">Users</p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">Manage users</h2>
        <p className="mt-2 text-gray-600">This is a simple placeholder page for the users section.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">User list</h3>
        <ul className="mt-4 space-y-3 text-sm text-gray-700">
          <li className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">Admin User</li>
          <li className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">Manager User</li>
          <li className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">Viewer User</li>
        </ul>
      </div>
    </section>
  );
}
