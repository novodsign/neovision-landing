import { MagneticButton } from '../components/MagneticButton';

const events = [
    { date: '21.10.25', city: 'Москва', venue: 'Mutabor', link: '#' },
    { date: '15.11.25', city: 'Санкт-Петербург', venue: 'Blank', link: '#' },
];

export const Events = () => {
    return (
        <section id="events" className="container" style={{ padding: '4rem 4vw' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>События</h2>
            <div>
                {events.map((evt, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        padding: '1.5rem 0',
                        borderBottom: '1px solid #333'
                    }}>
                        <div style={{ flex: '1', fontFamily: 'var(--font-header)', fontSize: '2rem' }}>{evt.date}</div>
                        <div style={{ flex: '2', fontSize: '1.5rem' }}>{evt.city} <span style={{ color: '#666' }}>/ {evt.venue}</span></div>
                        <MagneticButton
                            href={evt.link}
                            variant="secondary"
                            style={{ marginTop: '1rem' }}
                        >
                            Билеты
                        </MagneticButton>
                    </div>
                ))}
            </div>
        </section>
    );
};
