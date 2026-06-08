import { Plus } from 'lucide-react';

export default function PatientRegister({ newPatient, setNewPatient, handleAddPatient }) {
  return (
    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 h-fit">
      <h3 className="font-bold text-lg flex items-center gap-2 text-emerald-400">
        <Plus size={18} />
        Регистрация нового пациента
      </h3>
      <form onSubmit={handleAddPatient} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">ФИО Пациента</label>
          <input 
            type="text" 
            required
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            placeholder="Иванов Иван Иванович" 
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Дата рождения</label>
          <input 
            type="date" 
            required
            value={newPatient.birthDate}
            onChange={(e) => setNewPatient({ ...newPatient, birthDate: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Номер телефона</label>
          <input 
            type="text" 
            required
            value={newPatient.phone}
            onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
            placeholder="+7 (999) 999-99-99" 
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Номер полиса ОМС</label>
          <input 
            type="text" 
            required
            value={newPatient.policy}
            onChange={(e) => setNewPatient({ ...newPatient, policy: e.target.value })}
            placeholder="0000 0000 0000 0000" 
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        <button 
          type="submit"
          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-sm transition-all"
        >
          Зарегистрировать
        </button>
      </form>
    </div>
  );
}