import { useState } from 'react';

const initialValues = {
  name: '',
  phone: '',
};

export default function ContactForm({ onSubmit, saving }) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      name: values.name.trim(),
      phone: values.phone.trim(),
    });
    setValues(initialValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-2 text-base">
        <span className="font-medium text-slate-700">Full name</span>
        <input
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          className="min-h-[44px] w-full rounded-2xl bg-cream-50 px-4 text-slate-900 outline-none ring-1 ring-transparent transition focus:ring-brand-300"
          placeholder="Jordan Lee"
          autoComplete="name"
          required
        />
      </label>

      <label className="block space-y-2 text-base">
        <span className="font-medium text-slate-700">Phone number</span>
        <input
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          className="min-h-[44px] w-full rounded-2xl bg-cream-50 px-4 text-slate-900 outline-none ring-1 ring-transparent transition focus:ring-brand-300"
          placeholder="(555) 123-4567"
          autoComplete="tel"
          required
        />
      </label>

      <button type="submit" disabled={saving} className="min-h-[44px] w-full rounded-full bg-brand-600 px-6 py-3 font-semibold text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70">
        {saving ? 'Saving...' : 'Save contact'}
      </button>
    </form>
  );
}
