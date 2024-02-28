export default function InputBox({ label, placeholder, type, onChange }) {
  return (
    <div className='my-3'>
      <div className='text-sm font-medium text-left py-2'>{label}</div>
      <input
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className='w-full px-2 py-1 border rounded border-slate-200'
      />
    </div>
  );
}
