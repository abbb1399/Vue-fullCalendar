const categories = [
    {
        name: 'Danger',
        value: 'bg-danger'
    },
    {
        name: 'Success',
        value: 'bg-success'
    },
    {
        name: 'Primary',
        value: 'bg-primary'
    },
    {
        name: 'Info',
        value: 'bg-info'
    },
    {
        name: 'Dark',
        value: 'bg-dark'
    },
    {
        name: 'Warning',
        value: 'bg-warning'
    },
];

const calendarEvents = [
    {
        id: 1,
        title: '전인표',
        // start: new Date().setDate(new Date().getDate() + 2),
        start: new Date(),
        className: 'bg-warning text-white',
    },
    {
        id: 2,
        title: '서동민',
        start: new Date(),
        end: new Date(),
        className: 'bg-success text-white',
    },
    {
        id: 3,
        title: '김민식',
        start: new Date().setDate(new Date().getDate() - 2),
        className: 'bg-info text-white',
    },
    {
        id: 4,
        title: '안준수',
        start: new Date().setDate(new Date().getDate() - 1),
        className: 'bg-primary text-white'
    },
    {
        id: 5,
        title: '조아라',
        start: new Date().setDate(new Date().getDate() - 1),
        className: 'bg-success text-white'
    },
    {
        id: 6,
        title: '윤민근',
        start: new Date().setDate(new Date().getDate() - 1),
        className: 'bg-danger text-white'
    },
    {
        id: 7,
        title: '손한서',
        start: new Date().setDate(new Date().getDate() - 1),
        className: 'bg-info text-white'
    },
    {
        id: 8,
        title: '김태균',
        start: new Date().setDate(new Date().getDate() - 1),
        className: 'bg-dark text-white'
    },
    {
        id: 9,
        title: '유재현',
        start: new Date().setDate(new Date().getDate() - 1),
        className: 'bg-warning text-white'
    },


];
export { categories, calendarEvents };
