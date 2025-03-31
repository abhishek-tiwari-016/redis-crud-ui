import React, { useEffect, useState } from "react";
import { Table, Input} from "antd";
import type { ColumnsType } from "antd/es/table";

export interface Document {
    store: string;
    value: string;
    resource_id: string;
    section: string;
    language: string;
    retailer: string;
    type: string;
    endpoint: string;
}
export interface Documents {
    Id: string
    Properties: Document;
}

const EditableTable: React.FC = () => {
    const [data, setData] = useState<Documents[]>();
    const [searchText, setSearchText] = useState("");

    const fetchDocuments = async () => {
        try {
            const responseData = await fetch("/api/hello")
                .then(res => res.json());
            setData(responseData.message);
        } catch (err) { console.log("error fetching", err) }
    }

    useEffect(() => {
        fetchDocuments();
    }, []);
    const handleInputChange = (value: string, Id: string, field: keyof Document) => {
        const newData = data?.map((item) => (item.Id === Id ? { ...item, Properties: {...item.Properties, [field]: value }} : item));
        setData(newData);
    };
    const filteredData = data?.filter((item) => item.Properties.store.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Properties.retailer.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Properties.language.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Properties.endpoint.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Properties.type.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Properties.resource_id.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Properties.section.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Properties.value.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns: ColumnsType<Documents> = [
        { title: "Store", dataIndex: ["Properties", "store"], key: "store", render: (text, record) => <Input value={text} onChange={(e) => handleInputChange(e.target.value, record.Id, "store")} /> },
        { title: "Retailer", dataIndex: ["Properties", "retailer"], key: "retailer", render: (text, record) => <Input value={text} onChange={(e) => handleInputChange(e.target.value, record.Id, "retailer")} /> },
        { title: "Language", dataIndex: ["Properties", "language"], key: "language", render: (text, record) => <Input value={text} onChange={(e) => handleInputChange(e.target.value, record.Id, "language")} /> },
        { title: "Endpoint", dataIndex: ["Properties", "endpoint"], key: "endpoint", render: (text, record) => <Input value={text} onChange={(e) => handleInputChange(e.target.value, record.Id, "endpoint")} /> },
        { title: "Type", dataIndex: ["Properties", "type"], key: "type", render: (text, record) => <Input value={text} onChange={(e) => handleInputChange(e.target.value, record.Id, "type")} /> },
        { title: "ResourceID", dataIndex: ["Properties", "resource_id"], key: "resource_id", render: (text, record) => <Input value={text} onChange={(e) => handleInputChange(e.target.value, record.Id, "resource_id")} /> },
        { title: "Section", dataIndex: ["Properties", "section"], key: "section", render: (text, record) => <Input value={text} onChange={(e) => handleInputChange(e.target.value, record.Id, "section")} /> },
        { title: "Value", dataIndex: ["Properties", "value"], key: "value", render: (text, record) => <Input value={text} onChange={(e) => handleInputChange(e.target.value, record.Id, "value")} /> },
    ];

    return (
        <div>
            <Input placeholder="Search by fields....." onChange={(e) => setSearchText(e.target.value)} style={{ marginBottom: 16 }} />
            <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} />
        </div>
    );
}

export default EditableTable;