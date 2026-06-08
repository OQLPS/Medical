import { Plus } from 'lucide-react';

export default function MedicalRecords({ 
  role, 
  patients, 
  doctors, 
  records, 
  newRecord, 
  setNewRecord, 
  onAddRecord 
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 h-fit">
        <h3 className="font-bold text-lg text-emerald-400 flex items-center gap-2">
          <Plus size={18} />
          Добавить клиническую запись
        </h3>
        {role !== 'doctor' && role !== 'admin' ? (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs space-y-1">
            <p className="font-bold">Доступ ограничен</p>
            <p>Вносить записи в электронную медкарту может только врач с подтвержденной квалификацией.</p>
          </div>
        ) : (
          <form onSubmit={onAddRecord} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Выберите Пациента</label>
              <select 
                required
                value={newRecord.patientId}
                onChange={(e) => setNewRecord({ ...newRecord, patientId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="">-- Выберите пациента --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Врач (Автор записи)</label>
              <select 
                required
                value={newRecord.doctorId}
                onChange={(e) => setNewRecord({ ...newRecord, doctorId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="">-- Выберите врача --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Диагноз (МКБ-10)</label>
              <input 
                type="text" 
                required
                value={newRecord.diagnosis}
                onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                placeholder="J06.9 — Острая инфекция верхних дыхательных путей" 
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Назначения и рецепты</label>
              <textarea 
                rows="4"
                required
                value={newRecord.prescription}
                onChange={(e) => setNewRecord({ ...newRecord, prescription: e.target.value })}
                placeholder="Рецептурные препараты, дозировка, режим приема, рекомендации..." 
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-sm transition-all"
            >
              Сохранить в медкарту
            </button>
          </form>
        )}
      </div>

      <div className="lg:col-span-2 bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-lg">Записи в электронных картах пациентов</h3>
        <div className="space-y-4">
          {records.map(rec => {
            const pat = patients.find(p => p.id === rec.patientId);
            const doc = doctors.find(d => d.id === rec.doctorId);

            if (role === 'patient' && rec.patientId !== 'P-101') return null;

            return (
              <div key={rec.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <p className="text-xs text-slate-400">Пациент: <span className="font-semibold text-slate-200">{pat ? pat.name : 'Неизвестно'}</span></p>
                    <p className="text-xs text-slate-400">Врач: <span className="font-semibold text-slate-200">{doc ? doc.name : 'Неизвестно'}</span></p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                    Дата приема: {rec.date}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Диагноз по МКБ-10:</span>
                    <p className="text-sm font-bold text-slate-100">{rec.diagnosis}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">Назначенное лечение и рецепт:</span>
                    <p className="text-sm text-slate-300 leading-relaxed font-mono">{rec.prescription}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}