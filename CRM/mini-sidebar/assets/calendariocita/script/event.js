var event = {
    name: "Carmen Sánchez Vidal",
    organizer: "Asistente Administrativa",
    duration: 15,
    description: "descripcion medico.",
    date: new Date(),
    time: "9:00",
    attendees: []
};

sessionStorage.setItem("eventObj", JSON.stringify(event));