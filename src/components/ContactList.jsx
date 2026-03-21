export default function ContactList({ contacts }) {
  if (!contacts.length) {
    return <div className="rounded-3xl bg-cream-50 p-6 text-base text-slate-500">No submissions yet. Use the form above to add the first contact.</div>;
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <div key={contact.id} className="rounded-3xl bg-cream-50 p-4 shadow-sm">
          <p className="text-lg font-semibold text-slate-900">{contact.name}</p>
          <p className="mt-1 text-base text-slate-600">{contact.phone}</p>
        </div>
      ))}
    </div>
  );
}
