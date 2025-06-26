import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from "@react-pdf/renderer";
import { Orcamento } from "@/types/types";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f7fafd",
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica"
  },
  headerBar: {
    backgroundColor: "#1746a2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    alignItems: "center"
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },
  subHeader: {
    color: "#1746a2",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    // boxShadow removido pois não é suportado pelo react-pdf
    padding: 14,
    marginBottom: 7, // Espaçamento menor entre cards
    borderWidth: 1,
    borderColor: "#e0e7ef"
  },
  cardProjeto: {
    backgroundColor: "#f3f6fa",
    borderRadius: 8,
    padding: 14,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: "#e0e7ef"
  },
  sectionTitle: {
    color: "#1746a2",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 2
  },
  innerSection: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 10,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: "#e0e7ef"
  },
  innerDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e7ef",
    marginVertical: 8
  },
  total: {
    fontWeight: "bold",
    color: "#1746a2",
    fontSize: 15,
    marginTop: 8
  },
  agradecimento: {
    marginTop: 10,
    fontStyle: "italic",
    color: "#1746a2",
    textAlign: "center"
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2
  },
  infoLabel: {
    color: "#888",
    fontWeight: "bold"
  },
  infoValue: {
    color: "#222"
  },
  assinaturaCard: {
    backgroundColor: "#f3f6fa",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: "#e0e7ef",
    width: "45%",
    alignItems: "center"
  },
  assinaturaEspaco: {
    height: 40 // espaço grande para assinatura
  },
  assinaturaLinha: {
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
    width: "100%",
    marginBottom: 10
  },
  assinaturaNome: {
    fontSize: 11,
    color: "#1746a2",
    marginTop: 6,
    textAlign: "center"
  },
  assinaturaLabel: {
    fontSize: 10,
    color: "#888",
    textAlign: "center"
  },
  agradecimentoCard: {
    backgroundColor: "#eaf3ff",
    borderRadius: 8,
    padding: 14,
    marginTop: 30,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: "#d0e2ff"
  }
});

interface OrcamentoPDFProps {
  orcamento: Orcamento;
}

const infoAdicionais = [
  "Composição do orçamento: Inclui mão de obra, materiais e demais custos relacionados.",
  "Validade do orçamento: 7 dias a partir da emissão. Após esse período, os valores serão atualizados devido à variação nos preços dos insumos.",
  "Condições de pagamento: Início do trabalho mediante pagamento conforme acordado.",
  "Opções: pagamento integral via cartão de crédito (com taxa da maquininha) ou sinal de 50% do valor total no início e os 50% restantes após a conclusão do serviço.",
  "Desistência: Em caso de desistência após o início da produção, o valor do sinal não será reembolsado.",
  "Visita técnica: Obrigatória para confirmação de medidas antes da fabricação dos móveis.",
  "Responsabilidade na montagem: É necessário fornecer a planta hidráulica e elétrica da residência ou apartamento. Na ausência dessas informações, não nos responsabilizamos por danos a tubulações, fiação elétrica ou outras estruturas internas nas paredes."
];

export const OrcamentoPDFCliente: React.FC<OrcamentoPDFProps> = ({ orcamento }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Faixa de cabeçalho com logo/título */}
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Rampanelli Planejados</Text>
      </View>
      {/* Card: Dados principais */}
      <View style={styles.card}>
        <Text style={{ fontSize: 13, fontWeight: "bold", color: "#1746a2", marginBottom: 2, textAlign: "center" }}>
          Orçamento Nº {orcamento.id.padStart(6, "0")} - {orcamento.descricao} - {new Date(orcamento.data).toLocaleDateString("pt-BR")}
        </Text>
        <View style={styles.innerDivider} />
        <Text style={{ textAlign: "center", color: "#222", fontSize: 11, marginBottom: 2 }}>
          {orcamento.nome} | {orcamento.telefone} | {orcamento.email}
        </Text>
        <Text style={{ textAlign: "center", color: "#888", fontSize: 10, marginBottom: 2 }}>
          Rua Exemplo, 123 - Bairro Exemplo, São Paulo - SP
        </Text>
      </View>
      {/* Card: Projeto + Observações + Valor Total */}
      <View style={styles.cardProjeto}>
        <Text style={styles.sectionTitle}>Projeto</Text>
        <View style={styles.innerSection}>
          <Text>{orcamento.descricao}</Text>
        </View>
        <View style={styles.innerDivider} />
        <Text style={styles.sectionTitle}>Observações</Text>
        <View style={styles.innerSection}>
          {orcamento.observacoes.split("\n").map((linha, idx) => (
            <Text key={idx}>{linha}</Text>
          ))}
        </View>
        <View style={styles.innerDivider} />
        <Text style={styles.sectionTitle}>Valor Total</Text>
        <View style={styles.innerSection}>
          <Text style={styles.total}>R$ {orcamento.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
        </View>
      </View>
      {/* Card: Pagamento */}
      <View style={styles.card}>
        <Text style={styles.subHeader}>Pagamento</Text>
        <Text>Preço: R$ {orcamento.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
        <Text>Total: R$ {orcamento.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
        <View style={styles.innerDivider} />
        <Text style={styles.subHeader}>Meios de Pagamento</Text>
        <Text>Aceitamos:</Text>
        <Text>• Pix</Text>
        <Text>• Transferência bancária</Text>
        <Text>• Dinheiro</Text>
        <Text>• Cartão de crédito (sujeito à taxa da maquininha)</Text>
        <Text>• Cartão de débito</Text>
      </View>
      {/* Card: Garantia */}
      <View style={styles.card}>
        <Text style={styles.subHeader}>Garantia</Text>
        <Text>Período de garantia: 3 anos</Text>
        <Text style={{ color: "#888" }}>A garantia não cobre danos por mau uso, como batidas, riscos, excesso de peso sobre ou dentro dos móveis, entre outros.</Text>
      </View>
    </Page>
    <Page size="A4" style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.subHeader}>Informações Adicionais</Text>
        {infoAdicionais.map((item, idx) => (
          <Text key={idx} style={{ marginBottom: 6 }}>
            {idx + 1}. {item}
          </Text>
        ))}
      </View>
      {/* Assinaturas em cards separados */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
        <View style={styles.assinaturaCard}>
          <View style={styles.assinaturaEspaco} />
          <View style={styles.assinaturaLinha} />
          <Text style={styles.assinaturaNome}>{orcamento.nome}</Text>
          <Text style={styles.assinaturaLabel}>Contratante</Text>
        </View>
        <View style={styles.assinaturaCard}>
          <View style={styles.assinaturaEspaco} />
          <View style={styles.assinaturaLinha} />
          <Text style={styles.assinaturaNome}>Rampanelli Planejados</Text>
          <Text style={styles.assinaturaLabel}>Contratada</Text>
        </View>
      </View>
      {/* Agradecimento em card próprio */}
      <View style={styles.agradecimentoCard}>
        <Text style={{
          fontStyle: "italic",
          color: "#1746a2",
          textAlign: "center",
          fontSize: 11
        }}>
          A Rampanelli Planejados agradece pela confiança e preferência! Estamos à disposição para tornar seu projeto{"\n"}realidade.
        </Text>
      </View>
      {/* Rodapé */}
      <Text style={styles.footer}>Rampanelli Planejados • Qualidade e Excelência em Móveis Planejados | contato@rampanelli.com • (11) 99999-9999 • www.rampanelli.com</Text>
    </Page>
  </Document>
);
