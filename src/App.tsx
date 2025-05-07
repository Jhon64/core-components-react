import "./App.css";

import { Card01 } from "./components/cards/cards-01";
import { Input2 } from "./components/inputs/input2";
import { useState } from "react";
import { Button2 } from "./components/buttons/buttons";
import { InputCalendar } from "./components/inputs/inputCalendar/inputCalendar";

import { Select3 } from "./components/select3";

import  CheckBox3  from "./components/checkboxe3";

interface ISelectExample {
  id: number;
  label: string;
}

function App() {
  const [formSave, setFormSave] = useState({
    username: "",
    password: "",
    select: 1,
    fecha: Date.now(),
  });

  return (
    <>
      <Card01 className="w-1/2 mt-10 mx-auto">
        <div className="">
          <Input2
            label="Username"
            saveForm={formSave}
            saveKey="username"
            placeholder="Ingrese un usuario"
          />
          <br />
          <Input2
            label="Passsword"
            saveForm={formSave}
            saveKey="password"
            placeholder="Ingrese una clave"
          />
          <br />
          <InputCalendar saveForm={formSave} saveKey="fecha"></InputCalendar>
          <br />
          <Select3<ISelectExample>
            useSearch={true}
          
            saveForm={formSave}
            label="Selecttores"
            saveKey="select"
            keyLabel="label"
            keyValue="id"
            options={() => [
              { id: 1, label: "numero 1" },
              { id: 2, label: "numero 2" },
              { id: 3, label: "numero 3" },
            ]}
          ></Select3>
          <br />
          <CheckBox3 label="check box" ></CheckBox3>  
          <br/>
          <Button2
            outline
            primary
            class="w-full"
            onClick={() => {
              console.log(formSave);
              console.log("informacion de logeo");
              setFormSave({
                ...formSave,
              });
            }}
          >
            Login{" "}
          </Button2>
        </div>
      </Card01>
    </>
  );
}

export default App;
