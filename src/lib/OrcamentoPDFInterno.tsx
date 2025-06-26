import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from "@react-pdf/renderer";
import { Orcamento } from "@/types/types";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica"
  },
  header: {
    color: "#1746a2",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4
  },
  subHeader: {
    color: "#333",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2
  },
  section: {
    marginBottom: 12
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    marginBottom: 10
  },
  tableRow: {
    flexDirection: "row"
  },
  tableHeader: {
    backgroundColor: "#f3f6fa",
    fontWeight: "bold"
  },
  tableCell: {
    padding: 4,
    borderRightWidth: 0.5,
    borderRightColor: "#e0e0e0"
  },
  tableCellLast: {
    padding: 4
  },
  footer: {
    position: "absolute",
    left: 40,
    right: 40,
    bottom: 30,
    textAlign: "center",
    fontSize: 9,
    color: "#888"
  },
  total: {
    fontWeight: "bold",
    color: "#1746a2",
    fontSize: 13,
    marginTop: 8
  },
  agradecimento: {
    marginTop: 10,
    fontStyle: "italic",
    color: "#1746a2"
  },
  avisoInterno: {
    color: "#b71c1c",
    fontWeight: "bold",
    fontSize: 11,
    marginBottom: 8,
    textAlign: "center"
  }
});

interface OrcamentoPDFProps {
  orcamento: Orcamento;
}

export const OrcamentoPDFInterno: React.FC<OrcamentoPDFProps> = ({ orcamento }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>Orçamento de Móveis Planejados - Rampanelli Planejados</Text>
      <Text style={{ color: "#888", fontSize: 10, marginBottom: 8 }}>CNPJ: 00.000.000/0001-00</Text>
      <Text style={styles.subHeader}>ORÇAMENTO INTERNO</Text>
      <Text style={styles.avisoInterno}>DOCUMENTO INTERNO - NÃO COMPARTILHAR COM O CLIENTE</Text>
      <View style={{ borderBottomWidth: 1, borderBottomColor: "#e0e0e0", marginBottom: 8 }} />
      {/* Info principais */}
      <View style={styles.section}>
        <Text>Nº {orcamento.id.padStart(6, "0")}   Data: {new Date(orcamento.data).toLocaleDateString("pt-BR")}   Status: {orcamento.status.toUpperCase()}</Text>
      </View>
      {/* Cliente */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>DADOS DO CLIENTE</Text>
        <Text>Nome: {orcamento.nome}</Text>
        <Text>Telefone: {orcamento.telefone}   E-mail: {orcamento.email}</Text>
        <Text>Projeto: {orcamento.descricao}</Text>
      </View>
      {/* Tabela de itens */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { width: 30 }]}>ITEM</Text>
          <Text style={[styles.tableCell, { width: 180 }]}>DESCRIÇÃO</Text>
          <Text style={[styles.tableCell, { width: 40 }]}>QTD</Text>
          <Text style={[styles.tableCell, { width: 70 }]}>VALOR UNIT.</Text>
          <Text style={[styles.tableCellLast, { width: 80 }]}>VALOR TOTAL</Text>
        </View>
        {orcamento.itens.map((item, idx) => (
          <View style={styles.tableRow} key={idx}>
            <Text style={[styles.tableCell, { width: 30 }]}>{idx + 1}</Text>
            <Text style={[styles.tableCell, { width: 180 }]}>{item.nome}</Text>
            <Text style={[styles.tableCell, { width: 40 }]}>{item.quantidade}</Text>
            <Text style={[styles.tableCell, { width: 70 }]}>R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
            <Text style={[styles.tableCellLast, { width: 80 }]}>R$ {(item.valor * item.quantidade).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
          </View>
        ))}
        {orcamento.custosAdicionais?.map((custo, idx) => (
          <View style={styles.tableRow} key={"custo-" + idx}>
            <Text style={[styles.tableCell, { width: 30 }]}>{orcamento.itens.length + idx + 1}</Text>
            <Text style={[styles.tableCell, { width: 180 }]}>{custo.descricao} (Adicional)</Text>
            <Text style={[styles.tableCell, { width: 40 }]}>1</Text>
            <Text style={[styles.tableCell, { width: 70 }]}>R$ {custo.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
            <Text style={[styles.tableCellLast, { width: 80 }]}>R$ {custo.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
          </View>
        ))}
        {/* Mão de obra */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: 30 }]}>{orcamento.itens.length + (orcamento.custosAdicionais?.length || 0) + 1}</Text>
          <Text style={[styles.tableCell, { width: 180 }]}>Mão de Obra (Lucro)</Text>
          <Text style={[styles.tableCell, { width: 40 }]}>1</Text>
          <Text style={[styles.tableCell, { width: 70 }]}>R$ {orcamento.maoDeObra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
          <Text style={[styles.tableCellLast, { width: 80 }]}>R$ {orcamento.maoDeObra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
        </View>
      </View>
      {/* Totais */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 8 }}>
        <View>
          <Text>Subtotal Materiais: R$ {orcamento.itens.reduce((t, i) => t + i.valor * i.quantidade, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
          {orcamento.custosAdicionais && orcamento.custosAdicionais.length > 0 && (
            <Text>Custos Adicionais: R$ {orcamento.custosAdicionais.reduce((t, c) => t + c.valor, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
          )}
          <Text>Mão de Obra (Lucro): R$ {orcamento.maoDeObra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
          <Text style={styles.total}>VALOR TOTAL: R$ {orcamento.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
        </View>
      </View>
      {/* Observações */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Observações</Text>
        {orcamento.observacoes.split("\n").map((linha, idx) => (
          <Text key={idx}>{linha}</Text>
        ))}
      </View>
      {/* Rodapé */}
      <Text style={styles.footer}>DOCUMENTO INTERNO - NÃO COMPARTILHAR COM O CLIENTE | Rampanelli Planejados • contato@rampanelli.com • (11) 99999-9999</Text>
    </Page>
  </Document>
);
