import React, { useState } from 'react';
import DateInput from "../DateInput/DateInput.jsx";

const TreatmentContainer = ({treatments, setTreatments}) => {
    const [showModal, setShowModal] = useState(false);
    const [idInsumo, setIdInsumo] = useState('');
    const [dosis, setDosis] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFinal, setFechaFinal] = useState('');

    const handleAddTreatment = () => {
        const newTreatment = {
            idInsumo,
            dosis,
            fechaInicio,
            fechaFinal,
        };
        setTreatments([...treatments, newTreatment]);
        setShowModal(false);
        setIdInsumo('');
        setDosis('');
        setFechaInicio('');
        setFechaFinal('');
    };

    const handleDeleteTreatment = (index) => {
        const newTreatments = [...treatments];
        newTreatments.splice(index, 1);
        setTreatments(newTreatments);
    };

    const handleEditTreatment = (index) => {
        const treatmentToEdit = treatments[index];
        setIdInsumo(treatmentToEdit.idInsumo);
        setDosis(treatmentToEdit.dosis);
        setFechaInicio(treatmentToEdit.fechaInicio);
        setFechaFinal(treatmentToEdit.fechaFinal);
        handleDeleteTreatment(index);
        setShowModal(true);
    };

    return (
        <div>
            <button onClick={() => setShowModal(true)}>+</button>
            {treatments.map((treatment, index) => (
                <div key={index}>
                    <span onClick={() => handleEditTreatment(index)} style={{ backgroundColor: 'lightgray', padding: '5px' }}>{treatment.idInsumo}</span>
                    <button onClick={() => handleDeleteTreatment(index)}>X</button>
                </div>
            ))}
            {showModal && (
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                        <DateInput name="Fecha inicio" date={fechaInicio} setDate={setFechaInicio} />
                        <DateInput name="Fecha final" date={fechaFinal} setDate={setFechaFinal} />
                        <input type="text" placeholder="Id insumo" value={idInsumo} onChange={(e) => setIdInsumo(e.target.value)} />
                        <input type="text" placeholder="Dosis" value={dosis} onChange={(e) => setDosis(e.target.value)} />
                        <button onClick={handleAddTreatment}>Guardar</button>
                        <button onClick={() => setShowModal(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TreatmentContainer;
