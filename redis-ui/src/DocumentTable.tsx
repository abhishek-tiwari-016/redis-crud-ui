import React, { useEffect, useState } from "react";
import { Table, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import EditableModal from "./EditableModal";

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
    const [loading, setLoading] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<Documents | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchDocuments = async () => {
        try {
            const responseData = await fetch("/document/get")
                .then(res => res.json());
            setData(responseData.message);
        } catch (err) { console.log("error fetching", err) }
    }

    const handleRowClick = (record: Documents) => {
        setSelectedDoc(record);
        setIsModalOpen(true);
    }

    const handleSave = (updatedDoc: Documents) => {
        setData((prevData) =>
            prevData?.map((doc) => (doc.Id === updatedDoc.Id ? updatedDoc : doc))
        );
    }
    useEffect(() => {
        fetchDocuments();
    }, []);

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
        { title: "Store", dataIndex: ["Properties", "store"], key: "store" },
        { title: "Retailer", dataIndex: ["Properties", "retailer"], key: "retailer" },
        { title: "Language", dataIndex: ["Properties", "language"], key: "language" },
        { title: "Endpoint", dataIndex: ["Properties", "endpoint"], key: "endpoint" },
        { title: "Type", dataIndex: ["Properties", "type"], key: "type" },
        { title: "ResourceID", dataIndex: ["Properties", "resource_id"] },
        { title: "Section", dataIndex: ["Properties", "section"], key: "section" },
        { title: "Value", dataIndex: ["Properties", "value"], key: "value" },
    ];

    return (
        <div>
            <Input placeholder="Search by fields....." onChange={(e) => setSearchText(e.target.value)} style={{ marginBottom: 16 }} />
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="Id"
                loading={loading}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
                pagination={{ pageSize: 5 }} />
            {selectedDoc && (
                <EditableModal
                    visible={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    document={selectedDoc}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

export default EditableTable;