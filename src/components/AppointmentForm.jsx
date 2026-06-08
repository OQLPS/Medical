import { Calendar } from 'lucide-react';

export default function AppointmentForm({ 
  role, 
  patients, 
  doctors, 
  newAppointment, 
  setNewAppointment, 
  handleAddAppointment 
}) {
  return (
    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
      <h3 className="font-bold text-lg text-emerald-400 flex items-center gap-2">
        <Calendar size={18} />
        Запись на новый приём
      </h3>
      <form onSubmit={handleAddAppointment} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Выберите Пациента</label>
          {role === 'patient' ? (
            <input 
              type="text" 
              readOnly 
              value="Иванов Петр Сергеевич (Вы)" 
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none"
            />
          ) : (
            <select 
              required
              value={newAppointment.patientId}
              onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
            >
              <option value="">-- Выберите пациента --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Выберите Врача и специальность</label>
          <select 
            required
            value={newAppointment.doctorId}
            onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
          >
            <option value="">-- Выберите врача --</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Дата</label>
            <input 
              type="date" 
              required
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Время</label>
            <input 
              type="time" 
              required
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-sm transition-all"
        >
          {role === 'patient' ? 'Записаться на прием' : 'Записать пациента'}
        </button>
      </form>
    </div>
  );
}