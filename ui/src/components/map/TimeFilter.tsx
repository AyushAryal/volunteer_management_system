import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { storeState } from '@models/store';
import { Calendar } from 'primereact/calendar';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';


type Range = "year" | "six_months" | "three_months" | "month" | "week";

function getRange(range: Range): [Date, Date] {
    let daysInRange = {
        year: 365,
        six_months: 30 * 6,
        three_months: 30 * 3,
        month: 30,
        week: 7,
    };
    return [
        new Date(Date.now() - (daysInRange[range]) * 24 * 60 * 60 * 1000),
        new Date()
    ];
}

export function TimeFilter() {
    let [period, setPeriod] = useState<Range | "custom">("week");
    let startDate = useHookstate(storeState.mapControls.startDate);
    let endDate = useHookstate(storeState.mapControls.endDate);

    let onRadioChange = (event: RadioButtonChangeEvent) => {
        if (event.value != "custom") {
            let [start, end] = getRange(event.value as Range);
            startDate.set(start);
            endDate.set(end);
        }
        setPeriod(event.value);
    }

    let generalFilters = <div>
        <div
            className="gap-3"
            style={{
                display: "grid",
                gridTemplateColumns: "auto max-content",
            }}
        >
            <div className="flex align-items-center gap-1">
                <RadioButton
                    inputId="year"
                    name="year"
                    value="year"
                    checked={period === 'year'}
                    onChange={onRadioChange} />
                <label htmlFor="year">Year</label>
            </div>
            <div className="flex align-items-center gap-1">
                <RadioButton
                    inputId="six_months"
                    name="six_months"
                    value="six_months"
                    checked={period === 'six_months'}
                    onChange={onRadioChange} />
                <label htmlFor="six_months" className="flex-shrink-0">6 months</label>
            </div>
            <div className="flex align-items-center gap-1">
                <RadioButton
                    inputId="month"
                    name="month"
                    value="month"
                    checked={period === 'month'}
                    onChange={onRadioChange} />
                <label htmlFor="month">Month</label>
            </div>
            <div className="flex align-items-center gap-1">
                <RadioButton
                    inputId="three_months"
                    name="three_months"
                    value="three_months"
                    checked={period === 'three_months'}
                    onChange={onRadioChange} />
                <label htmlFor="three_months">3 months</label>
            </div>
            <div className="flex align-items-center gap-1">
                <RadioButton
                    inputId="week"
                    name="week"
                    value="week"
                    checked={period === 'week'}
                    onChange={onRadioChange} />
                <label htmlFor="week">Week</label>
            </div>
            <div className="flex align-items-center gap-1">
                <RadioButton
                    inputId="custom"
                    name="custom"
                    value="custom"
                    checked={period === 'custom'}
                    onChange={onRadioChange} />
                <label htmlFor="custom">Custom</label>
            </div>
        </div>
    </div>;

    let customFilter = <div className="flex flex-column gap-1">
        <div className="flex flex-row align-items-center gap-2 justify-content-between">
            <span className="text-base"> Start </span>
            <Calendar
                style={{ height: "2.2rem" }}
                inputStyle={{ width: "7rem" }}
                value={startDate.get()}
                onChange={(e) => startDate.set(e.value ?? null)}
                showIcon
                showButtonBar
            />
        </div>
        <div className="flex flex-row align-items-center gap-2 justify-content-between">
            <span className="text-base"> End </span>
            <Calendar
                style={{ height: "2.2rem" }}
                inputStyle={{ width: "7rem" }}
                value={endDate.get()}
                onChange={(e) => endDate.set(e.value ?? null)}
                showIcon
                showButtonBar
            />
        </div>
    </div>;

    return <div className="flex flex-column gap-1 bg-white p-3 text-base shadow-5 border-round-lg border-2 border-primary">
        {generalFilters}
        {period === "custom" ? customFilter : null}
    </div>;
}
