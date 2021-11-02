import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {restServices} from "../../cuba/services";
import {getCubaREST} from "@cuba-platform/react-core";
import {Button, Divider, Form, Input, Select, Table} from "antd";
import { useForm } from "antd/es/form/Form";
import {Car} from "../../cuba/entities/scr$Car";
import {SerializedEntity} from "@cuba-platform/rest";
import {observer} from "mobx-react";

type Favorite = {id: string, _instanceName: string, notes: string};

const HomePage = observer(() => {
  const [cars, setCars] = useState<SerializedEntity<Car>[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const cubaApp = getCubaREST();
  const [form] = useForm();

  const loadFavorites = useCallback(() => {
    if (cubaApp == null) {
      return;
    }
    // Using rest service the get the list favorite cars.
    // restServices object is part of TypeScript SDK
    restServices
      .scr_FavoriteService
      .getFavorites(cubaApp)()
      .then((res: string) => {
        const favs = JSON.parse(res).map((favCar: Favorite) => {
          return {id: favCar.id, _instanceName: favCar._instanceName, notes: favCar.notes};
        });
        setFavorites(favs)
      });
  }, [cubaApp]);
  
  useEffect(() => {
    loadFavorites();    
  }, []);

  useEffect(() => {
    if (cubaApp == null) {
      return;
    }
    // Loading entities. We could use DataCollection for that, but here we demonstrate how to use CUBA REST directly.
    cubaApp.loadEntities<Car>('scr$Car').then(c => setCars(c));
  }, [cubaApp]);

  const handleSubmit = useCallback((values: { carId: string, notes: string }) => {
    const {carId, notes} = values;
    if (carId == null || notes == null || notes === '' || cubaApp == null) {
      alert('Error');
      return;
    }
    // Invoking REST service method to add a Car to the list of favorite cars
    restServices
      .scr_FavoriteService
      .addFavorite(cubaApp)(values)
      .then(() => {
        loadFavorites();
      });
  }, [cubaApp]);

  return (
    <>
      <Table dataSource={favorites}
             columns={[
               {title: 'Car', dataIndex: '_instanceName', key: '_instanceName'},
               {title: 'Notes', dataIndex: 'notes', key: 'notes'},
             ]}
             rowKey={r => r.id}
      />
      <Divider/>
      <div>
        <Form form={form}
              layout="vertical"
              onFinish={handleSubmit}
        >
          <Form.Item name={'carId'} label={'Car'}>
            <Select>
              {cars
                .filter(c => c.id != null)
                .map(c => (
                  <Select.Option value={c.id!}
                                 key={c.id!}
                  >
                    {c._instanceName}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name={'notes'} label={'Notes'}>
            <Input/>
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: "8px" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
});


export default HomePage;
