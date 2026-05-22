import Link from 'next/link';

const stats = [
  { label: 'Képek szükséges', value: '—', href: '/images' },
  { label: 'Hangok szükséges', value: '—', href: '/sounds' },
  { label: 'Publikált csomag', value: '—', href: '/publish' },
];

const sections = [
  {
    href: '/images',
    emoji: '🖼️',
    title: 'Képek',
    desc: 'Képszükségletek listája, feltöltés, jóváhagyás és publikálás',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    href: '/sounds',
    emoji: '🔊',
    title: 'Hangok',
    desc: 'Hangszükségletek listája, feltöltés, jóváhagyás és publikálás',
    color: 'bg-green-50 border-green-200',
  },
  {
    href: '/curriculum',
    emoji: '📚',
    title: 'Curriculum',
    desc: 'Betűk, szótagok, szavak áttekintése szint szerint',
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    href: '/publish',
    emoji: '🚀',
    title: 'Publikálás',
    desc: 'Tartalom csomag összeállítása és publikálása',
    color: 'bg-purple-50 border-purple-200',
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#2D5A27]">
          Üdvözöljük a Betűkert Adminban
        </h1>
        <p className="text-gray-500 mt-2">
          Tartalom kezelés, képek és hangok feltöltése, curriculum áttekintés
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Link
            key={stat.href}
            href={stat.href}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-2xl font-bold text-[#2D5A27]">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map(section => (
          <Link
            key={section.href}
            href={section.href}
            className={`rounded-xl p-6 border-2 ${section.color} hover:shadow-md transition-shadow`}
          >
            <div className="text-3xl mb-3">{section.emoji}</div>
            <h2 className="text-xl font-bold text-[#2D5A27] mb-2">
              {section.title}
            </h2>
            <p className="text-gray-600 text-sm">{section.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
