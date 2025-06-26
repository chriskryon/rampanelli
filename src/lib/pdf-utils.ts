import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Orcamento } from "@/types/types"

export async function gerarPDFInternoUtil(orcamento: Orcamento): Promise<Uint8Array> {
  // Margens configuráveis
  const MARGEM_SUPERIOR = 40
  const MARGEM_INFERIOR = 40
  const MARGEM_ESQUERDA = 40
  const MARGEM_DIREITA = 40
  const LARGURA_PAGINA = 595
  const ALTURA_PAGINA = 842
  const LARGURA_UTIL = LARGURA_PAGINA - MARGEM_ESQUERDA - MARGEM_DIREITA

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([LARGURA_PAGINA, ALTURA_PAGINA])
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const corPreta = rgb(0, 0, 0)
  const corCinza = rgb(0.4, 0.4, 0.4)
  const corAzul = rgb(0.1, 0.3, 0.7)
  const corHeader = rgb(0.95, 0.97, 1)

  let yPos = ALTURA_PAGINA - MARGEM_SUPERIOR
  const rodapeAltura = 40
  const rodapeY = MARGEM_INFERIOR
  const rodapeLinhaY = rodapeY + rodapeAltura - 20
  const rodapeTexto1Y = rodapeY + rodapeAltura - 30
  const rodapeTexto2Y = rodapeY + rodapeAltura - 45
  const yMin = rodapeY + rodapeAltura + 10

  // Título principal
  page.drawText("Orçamento de Móveis Planejados - Rampanelli Planejados", { x: MARGEM_ESQUERDA + 15, y: yPos, size: 16, font: helveticaBold, color: corAzul })
  yPos -= 25
  page.drawText("CNPJ: 00.000.000/0001-00", { x: MARGEM_ESQUERDA + 15, y: yPos, size: 10, font: helveticaFont, color: corCinza })
  yPos -= 20
  page.drawText("ORÇAMENTO INTERNO", { x: MARGEM_ESQUERDA + 15, y: yPos, size: 12, font: helveticaBold, color: corPreta })
  yPos -= 18
  page.drawLine({ start: { x: MARGEM_ESQUERDA, y: yPos }, end: { x: LARGURA_PAGINA - MARGEM_DIREITA, y: yPos }, thickness: 1, color: corCinza })
  yPos -= 18

  // Info principais
  page.drawText(`Nº ${orcamento.id.padStart(6, "0")}`, { x: MARGEM_ESQUERDA + 15, y: yPos, size: 12, font: helveticaBold, color: corPreta })
  const dataFormatada = format(new Date(orcamento.data), "dd/MM/yyyy", { locale: ptBR })
  page.drawText(`Data: ${dataFormatada}`, { x: 180, y: yPos, size: 10, font: helveticaFont, color: corCinza })
  page.drawText(`Status: ${orcamento.status.toUpperCase()}`, { x: 400, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  yPos -= 18
  page.drawLine({ start: { x: 40, y: yPos }, end: { x: 555, y: yPos }, thickness: 1, color: corCinza })
  yPos -= 18

  // Cliente
  page.drawText("DADOS DO CLIENTE", { x: MARGEM_ESQUERDA + 15, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  yPos -= 15
  page.drawText(`Nome: ${orcamento.nome}`, { x: MARGEM_ESQUERDA + 15, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  yPos -= 13
  page.drawText(`Telefone: ${orcamento.telefone}`, { x: MARGEM_ESQUERDA + 15, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  page.drawText(`E-mail: ${orcamento.email}`, { x: 300, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  yPos -= 13
  page.drawText(`Projeto: ${orcamento.descricao}`, { x: MARGEM_ESQUERDA + 15, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  yPos -= 18
  page.drawLine({ start: { x: 40, y: yPos }, end: { x: 555, y: yPos }, thickness: 1, color: corCinza })
  yPos -= 20

  // Tabela de itens
  page.drawRectangle({ x: 40, y: yPos - 2, width: 515, height: 20, color: corHeader })
  page.drawText("ITEM", { x: 55, y: yPos + 3, size: 10, font: helveticaBold, color: corPreta })
  page.drawText("DESCRIÇÃO", { x: 95, y: yPos + 3, size: 10, font: helveticaBold, color: corPreta })
  page.drawText("QTD", { x: 320, y: yPos + 3, size: 10, font: helveticaBold, color: corPreta })
  page.drawText("VALOR UNIT.", { x: 370, y: yPos + 3, size: 10, font: helveticaBold, color: corPreta })
  page.drawText("VALOR TOTAL", { x: 470, y: yPos + 3, size: 10, font: helveticaBold, color: corPreta })
  yPos -= 18
  page.drawLine({ start: { x: 40, y: yPos }, end: { x: 555, y: yPos }, thickness: 0.7, color: corCinza })

  orcamento.itens.forEach((item, index) => {
    yPos -= 15
    page.drawText(`${index + 1}`, { x: 55, y: yPos, size: 10, font: helveticaFont, color: corPreta })
    page.drawText(item.nome, { x: 95, y: yPos, size: 10, font: helveticaFont, color: corPreta })
    page.drawText(`${item.quantidade}`, { x: 320, y: yPos, size: 10, font: helveticaFont, color: corPreta })
    page.drawText(`R$ ${item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      { x: 370, y: yPos, size: 10, font: helveticaFont, color: corPreta })
    page.drawText(`R$ ${(item.valor * item.quantidade).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      { x: 470, y: yPos, size: 10, font: helveticaBold, color: corPreta })
    page.drawLine({ start: { x: 55, y: yPos - 3 }, end: { x: 545, y: yPos - 3 }, thickness: 0.3, color: corCinza })
  })
  if (orcamento.custosAdicionais && orcamento.custosAdicionais.length > 0) {
    orcamento.custosAdicionais.forEach((custo, index) => {
      yPos -= 15
      page.drawText(`${orcamento.itens.length + index + 1}`, { x: 55, y: yPos, size: 10, font: helveticaFont, color: corPreta })
      page.drawText(`${custo.descricao} (Adicional)`, { x: 95, y: yPos, size: 10, font: helveticaFont, color: corPreta })
      page.drawText("1", { x: 320, y: yPos, size: 10, font: helveticaFont, color: corPreta })
      page.drawText(`R$ ${custo.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        { x: 370, y: yPos, size: 10, font: helveticaFont, color: corPreta })
      page.drawText(`R$ ${custo.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        { x: 470, y: yPos, size: 10, font: helveticaBold, color: corPreta })
      page.drawLine({ start: { x: 55, y: yPos - 3 }, end: { x: 545, y: yPos - 3 }, thickness: 0.3, color: corCinza })
    })
  }
  // Mão de obra
  yPos -= 15
  page.drawText(`${orcamento.itens.length + (orcamento.custosAdicionais?.length || 0) + 1}`, { x: 55, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  page.drawText("Mão de Obra (Lucro)", { x: 95, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  page.drawText("1", { x: 320, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  page.drawText(`R$ ${orcamento.maoDeObra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    { x: 370, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  page.drawText(`R$ ${orcamento.maoDeObra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    { x: 470, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  yPos -= 18
  page.drawLine({ start: { x: 40, y: yPos }, end: { x: 555, y: yPos }, thickness: 0.7, color: corCinza })

  // Totais
  yPos -= 10
  const valorItens = orcamento.itens.reduce((total, item) => total + item.valor * item.quantidade, 0)
  const valorCustosAdicionais = orcamento.custosAdicionais ? orcamento.custosAdicionais.reduce((total, custo) => total + custo.valor, 0) : 0
  page.drawText("Subtotal Materiais:", { x: 320, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  page.drawText(`R$ ${valorItens.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    { x: 470, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  yPos -= 15
  if (valorCustosAdicionais > 0) {
    page.drawText("Custos Adicionais:", { x: 320, y: yPos, size: 10, font: helveticaBold, color: corPreta })
    page.drawText(`R$ ${valorCustosAdicionais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      { x: 470, y: yPos, size: 10, font: helveticaFont, color: corPreta })
    yPos -= 15
  }
  page.drawText("Mão de Obra (Lucro):", { x: 320, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  page.drawText(`R$ ${orcamento.maoDeObra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    { x: 470, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  yPos -= 15
  page.drawLine({ start: { x: 320, y: yPos - 5 }, end: { x: 555, y: yPos - 5 }, thickness: 0.7, color: corAzul })
  yPos -= 20
  // Total
  page.drawText("VALOR TOTAL:", { x: 320, y: yPos, size: 13, font: helveticaBold, color: corAzul })
  page.drawText(`R$ ${orcamento.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    { x: 470, y: yPos, size: 13, font: helveticaBold, color: corAzul })
  yPos -= 30

  // Meios de Pagamento
  page.drawText("Meios de Pagamento", { x: 55, y: yPos, size: 11, font: helveticaBold, color: corPreta })
  yPos -= 15
  const pagamentos = [
    "Pix",
    "Transferência bancária",
    "Dinheiro",
    "Cartão de crédito (sujeito à taxa da maquininha)",
    "Cartão de débito"
  ]
  pagamentos.forEach((p) => {
    page.drawText(`• ${p}`, { x: 65, y: yPos, size: 10, font: helveticaFont, color: corPreta })
    yPos -= 12
  })
  yPos -= 8

  // Garantia
  page.drawText("Garantia", { x: 55, y: yPos, size: 11, font: helveticaBold, color: corPreta })
  yPos -= 15
  page.drawText("Período de garantia: 3 anos", { x: 65, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  yPos -= 12
  page.drawText("A garantia não cobre danos decorrentes de mau uso, como batidas, riscos, excesso de peso sobre ou dentro dos móveis, entre outros.", { x: 65, y: yPos, size: 9, font: helveticaFont, color: corCinza })
  yPos -= 18

  // Informações Adicionais
  page.drawText("Informações Adicionais", { x: 55, y: yPos, size: 11, font: helveticaBold, color: corPreta })
  yPos -= 15
  const infoAdic = [
    "Composição do orçamento: Inclui mão de obra, materiais e demais custos relacionados.",
    "Validade do orçamento: 7 dias a partir da emissão. Após esse período, os valores serão atualizados devido à variação nos preços dos insumos.",
    "Condições de pagamento:",
    "  Início do trabalho mediante pagamento conforme acordado.",
    "  Opções: pagamento integral via cartão de crédito (com taxa da maquininha) ou sinal de 50% do valor total no início e os 50% restantes após a conclusão do serviço.",
    "Desistência: Em caso de desistência após o início da produção, o valor do sinal não será reembolsado.",
    "Visita técnica: Obrigatória para confirmação de medidas antes da fabricação dos móveis.",
    "Responsabilidade na montagem: É necessário fornecer a planta hidráulica e elétrica da residência ou apartamento. Na ausência dessas informações, não nos responsabilizamos por danos a tubulações, fiação elétrica ou outras estruturas internas nas paredes."
  ]
  infoAdic.forEach((info) => {
    page.drawText(info, { x: 65, y: yPos, size: 9, font: helveticaFont, color: corCinza })
    yPos -= 12
  })
  yPos -= 10

  // Agradecimento
  page.drawText("Agradecimento", { x: 55, y: yPos, size: 11, font: helveticaBold, color: corPreta })
  yPos -= 15
  page.drawText("A Rampanelli Planejados agradece pela confiança e preferência! Estamos à disposição para tornar seu projeto realidade.", { x: 65, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  yPos -= 25

  // Observações
  page.drawText("OBSERVAÇÕES", { x: 55, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  yPos -= 15
  const observacoesLinhas = orcamento.observacoes.split("\n")
  observacoesLinhas.forEach((linha) => {
    if (yPos < yMin) return; // Evita sobrepor o rodapé
    page.drawText(linha, { x: MARGEM_ESQUERDA + 15, y: yPos, size: 10, font: helveticaFont, color: corPreta })
    yPos -= 13
  })
  yPos -= 10

  // Termos
  if (yPos > yMin + 20) { // Só imprime se houver espaço suficiente
    page.drawText("TERMOS E CONDIÇÕES", { x: MARGEM_ESQUERDA + 15, y: yPos, size: 10, font: helveticaBold, color: corPreta })
    yPos -= 13
    const terms = [
      "• Pagamentos devem ser realizados em até 15 dias da data do orçamento.",
      "• Uma taxa de 1,5% ao mês será aplicada a pagamentos em atraso.",
      "• Todos os materiais e serviços são cobertos por garantia de 1 ano.",
      "• A entrega está prevista para 15 dias úteis após a aprovação do orçamento.",
      "• Alterações no projeto podem resultar em custos adicionais e atrasos na entrega.",
      "• Este orçamento é válido por 30 dias a partir da data de emissão.",
    ]
    terms.forEach((term) => {
      if (yPos < yMin) return;
      page.drawText(term, { x: MARGEM_ESQUERDA + 15, y: yPos, size: 9, font: helveticaFont, color: corCinza })
      yPos -= 12
    })
    yPos -= 10
  }

  // Rodapé moderno dinâmico
  const bottomMargin = 40;
  yPos = Math.max(yPos, bottomMargin + 25); // Garante espaço mínimo antes do rodapé
  const footerLineY = bottomMargin + 10;
  const footerTextY = bottomMargin;
  const footerText2Y = bottomMargin - 15;
  // Linha divisória
  page.drawLine({ start: { x: 40, y: footerLineY }, end: { x: 555, y: footerLineY }, thickness: 1, color: corCinza });
  // Centraliza o texto do rodapé
  const footerText = "DOCUMENTO INTERNO - NÃO COMPARTILHAR COM O CLIENTE";
  const footerText2 = "Rampanelli Planejados • contato@rampanelli.com • (11) 99999-9999";
  const textWidth = helveticaBold.widthOfTextAtSize(footerText, 10);
  const text2Width = helveticaFont.widthOfTextAtSize(footerText2, 8);
  const centerX = (595 - textWidth) / 2;
  const center2X = (595 - text2Width) / 2;
  page.drawText(footerText, { x: centerX, y: footerTextY, size: 10, font: helveticaBold, color: corPreta });
  page.drawText(footerText2, { x: center2X, y: footerText2Y, size: 8, font: helveticaFont, color: corCinza });
  return await pdfDoc.save()
}

export async function gerarPDFClienteUtil(orcamento: Orcamento): Promise<Uint8Array> {
  // Margens configuráveis
  const MARGEM_SUPERIOR = 40
  const MARGEM_INFERIOR = 40
  const MARGEM_ESQUERDA = 40
  const MARGEM_DIREITA = 40
  const LARGURA_PAGINA = 595
  const ALTURA_PAGINA = 842
  const LARGURA_UTIL = LARGURA_PAGINA - MARGEM_ESQUERDA - MARGEM_DIREITA

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([LARGURA_PAGINA, ALTURA_PAGINA])
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const corPreta = rgb(0, 0, 0)
  const corCinza = rgb(0.5, 0.5, 0.5)
  const corHeader = rgb(0.95, 0.97, 1)
  const corAzul = rgb(0.1, 0.3, 0.7)

  let yPos = ALTURA_PAGINA - MARGEM_SUPERIOR
  const rodapeAltura = 40
  const rodapeY = MARGEM_INFERIOR
  const rodapeLinhaY = rodapeY + rodapeAltura - 20
  const rodapeTexto1Y = rodapeY + rodapeAltura - 30
  const rodapeTexto2Y = rodapeY + rodapeAltura - 45
  const yMin = rodapeY + rodapeAltura + 10

  // Título principal
  page.drawText("Orçamento de Móveis Planejados - Rampanelli Planejados", { x: MARGEM_ESQUERDA + 10, y: yPos, size: 16, font: helveticaBold, color: corAzul })
  yPos -= 25
  page.drawText("CNPJ: 00.000.000/0001-00", { x: MARGEM_ESQUERDA + 10, y: yPos, size: 10, font: helveticaFont, color: corCinza })
  yPos -= 20
  page.drawText("ORÇAMENTO", { x: MARGEM_ESQUERDA + 10, y: yPos, size: 12, font: helveticaBold, color: corPreta })
  yPos -= 18
  page.drawLine({ start: { x: MARGEM_ESQUERDA, y: yPos }, end: { x: LARGURA_PAGINA - MARGEM_DIREITA, y: yPos }, thickness: 1, color: corCinza })
  yPos -= 18

  // Info principais
  page.drawText(`Nº ${orcamento.id.padStart(6, "0")}`, { x: MARGEM_ESQUERDA + 10, y: yPos, size: 12, font: helveticaBold, color: corPreta })
  const dataFormatada = format(new Date(orcamento.data), "dd/MM/yyyy", { locale: ptBR })
  page.drawText(`Data: ${dataFormatada}`, { x: 180, y: yPos, size: 10, font: helveticaFont, color: corCinza })
  const validityDate = new Date()
  validityDate.setDate(validityDate.getDate() + 7)
  const validityDateStr = validityDate.toLocaleDateString("pt-BR")
  page.drawText(`Válido até: ${validityDateStr}`, { x: 400, y: yPos, size: 10, font: helveticaFont, color: corCinza })
  yPos -= 18
  page.drawLine({ start: { x: 40, y: yPos }, end: { x: 555, y: yPos }, thickness: 1, color: corCinza })
  yPos -= 18

  // Cliente
  page.drawText("DADOS DO CLIENTE", { x: MARGEM_ESQUERDA + 10, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  yPos -= 15
  page.drawText(`Nome: ${orcamento.nome}`, { x: MARGEM_ESQUERDA + 10, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  yPos -= 13
  page.drawText(`Telefone: ${orcamento.telefone}`, { x: MARGEM_ESQUERDA + 10, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  page.drawText(`E-mail: ${orcamento.email}`, { x: 300, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  yPos -= 13
  page.drawText(`Projeto: ${orcamento.descricao}`, { x: MARGEM_ESQUERDA + 10, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  yPos -= 18
  page.drawLine({ start: { x: 40, y: yPos }, end: { x: 555, y: yPos }, thickness: 1, color: corCinza })
  yPos -= 20

  // Tabela de itens
  page.drawRectangle({ x: 40, y: yPos - 2, width: 515, height: 20, color: corHeader })
  page.drawText("ITEM", { x: 55, y: yPos + 3, size: 10, font: helveticaBold, color: corPreta })
  page.drawText("DESCRIÇÃO", { x: 95, y: yPos + 3, size: 10, font: helveticaBold, color: corPreta })
  page.drawText("QTD", { x: 320, y: yPos + 3, size: 10, font: helveticaBold, color: corPreta })
  page.drawText("VALOR UNIT.", { x: 370, y: yPos + 3, size: 10, font: helveticaBold, color: corPreta })
  page.drawText("VALOR TOTAL", { x: 470, y: yPos + 3, size: 10, font: helveticaBold, color: corPreta })
  yPos -= 18
  page.drawLine({ start: { x: 40, y: yPos }, end: { x: 555, y: yPos }, thickness: 0.7, color: corCinza })

  orcamento.itens.forEach((item, index) => {
    yPos -= 15
    page.drawText(`${index + 1}`, { x: 55, y: yPos, size: 10, font: helveticaFont, color: corPreta })
    page.drawText(item.nome, { x: 95, y: yPos, size: 10, font: helveticaFont, color: corPreta })
    page.drawText(`${item.quantidade}`, { x: 320, y: yPos, size: 10, font: helveticaFont, color: corPreta })
    page.drawText(`R$ ${item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      { x: 370, y: yPos, size: 10, font: helveticaFont, color: corPreta })
    page.drawText(`R$ ${(item.valor * item.quantidade).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      { x: 470, y: yPos, size: 10, font: helveticaBold, color: corPreta })
    page.drawLine({ start: { x: 55, y: yPos - 3 }, end: { x: 545, y: yPos - 3 }, thickness: 0.3, color: corCinza })
  })
  if (orcamento.custosAdicionais && orcamento.custosAdicionais.length > 0) {
    orcamento.custosAdicionais.forEach((custo, index) => {
      yPos -= 15
      page.drawText(`${orcamento.itens.length + index + 1}`, { x: 55, y: yPos, size: 10, font: helveticaFont, color: corPreta })
      page.drawText(`${custo.descricao} (Adicional)`, { x: 95, y: yPos, size: 10, font: helveticaFont, color: corPreta })
      page.drawText("1", { x: 320, y: yPos, size: 10, font: helveticaFont, color: corPreta })
      page.drawText(`R$ ${custo.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        { x: 370, y: yPos, size: 10, font: helveticaFont, color: corPreta })
      page.drawText(`R$ ${custo.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        { x: 470, y: yPos, size: 10, font: helveticaBold, color: corPreta })
      page.drawLine({ start: { x: 55, y: yPos - 3 }, end: { x: 545, y: yPos - 3 }, thickness: 0.3, color: corCinza })
    })
  }
  // Mão de obra
  yPos -= 15
  page.drawText(`${orcamento.itens.length + (orcamento.custosAdicionais?.length || 0) + 1}`, { x: 55, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  page.drawText("Mão de Obra", { x: 95, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  page.drawText("1", { x: 320, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  page.drawText(`R$ ${orcamento.maoDeObra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    { x: 370, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  page.drawText(`R$ ${orcamento.maoDeObra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    { x: 470, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  yPos -= 18
  page.drawLine({ start: { x: 40, y: yPos }, end: { x: 555, y: yPos }, thickness: 0.7, color: corCinza })

  // Totais
  yPos -= 10
  const valorItens = orcamento.itens.reduce((total, item) => total + item.valor * item.quantidade, 0)
  const valorCustosAdicionais = orcamento.custosAdicionais ? orcamento.custosAdicionais.reduce((total, custo) => total + custo.valor, 0) : 0
  page.drawText("Subtotal Materiais:", { x: 320, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  page.drawText(`R$ ${valorItens.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    { x: 470, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  yPos -= 15
  if (valorCustosAdicionais > 0) {
    page.drawText("Custos Adicionais:", { x: 320, y: yPos, size: 10, font: helveticaBold, color: corPreta })
    page.drawText(`R$ ${valorCustosAdicionais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      { x: 470, y: yPos, size: 10, font: helveticaFont, color: corPreta })
    yPos -= 15
  }
  page.drawText("Mão de Obra:", { x: 320, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  page.drawText(`R$ ${orcamento.maoDeObra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    { x: 470, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  yPos -= 15
  page.drawLine({ start: { x: 320, y: yPos - 5 }, end: { x: 555, y: yPos - 5 }, thickness: 0.7, color: corAzul })
  yPos -= 20
  // Total
  page.drawText("VALOR TOTAL:", { x: 320, y: yPos, size: 13, font: helveticaBold, color: corAzul })
  page.drawText(`R$ ${orcamento.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    { x: 470, y: yPos, size: 13, font: helveticaBold, color: corAzul })
  yPos -= 30

  // Meios de Pagamento
  page.drawText("Meios de Pagamento", { x: 50, y: yPos, size: 11, font: helveticaBold, color: corPreta })
  yPos -= 15
  const pagamentos = [
    "Pix",
    "Transferência bancária",
    "Dinheiro",
    "Cartão de crédito (sujeito à taxa da maquininha)",
    "Cartão de débito"
  ]
  pagamentos.forEach((p) => {
    page.drawText(`• ${p}`, { x: 60, y: yPos, size: 10, font: helveticaFont, color: corPreta })
    yPos -= 12
  })
  yPos -= 8

  // Garantia
  page.drawText("Garantia", { x: 50, y: yPos, size: 11, font: helveticaBold, color: corPreta })
  yPos -= 15
  page.drawText("Período de garantia: 3 anos", { x: 60, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  yPos -= 12
  page.drawText("A garantia não cobre danos decorrentes de mau uso, como batidas, riscos, excesso de peso sobre ou dentro dos móveis, entre outros.", { x: 60, y: yPos, size: 9, font: helveticaFont, color: corCinza })
  yPos -= 18

  // Informações Adicionais
  page.drawText("Informações Adicionais", { x: 50, y: yPos, size: 11, font: helveticaBold, color: corPreta })
  yPos -= 15
  const infoAdic = [
    "Composição do orçamento: Inclui mão de obra, materiais e demais custos relacionados.",
    "Validade do orçamento: 7 dias a partir da emissão. Após esse período, os valores serão atualizados devido à variação nos preços dos insumos.",
    "Condições de pagamento:",
    "  Início do trabalho mediante pagamento conforme acordado.",
    "  Opções: pagamento integral via cartão de crédito (com taxa da maquininha) ou sinal de 50% do valor total no início e os 50% restantes após a conclusão do serviço.",
    "Desistência: Em caso de desistência após o início da produção, o valor do sinal não será reembolsado.",
    "Visita técnica: Obrigatória para confirmação de medidas antes da fabricação dos móveis.",
    "Responsabilidade na montagem: É necessário fornecer a planta hidráulica e elétrica da residência ou apartamento. Na ausência dessas informações, não nos responsabilizamos por danos a tubulações, fiação elétrica ou outras estruturas internas nas paredes."
  ]
  infoAdic.forEach((info) => {
    page.drawText(info, { x: 60, y: yPos, size: 9, font: helveticaFont, color: corCinza })
    yPos -= 12
  })
  yPos -= 10

  // Agradecimento
  page.drawText("Agradecimento", { x: 50, y: yPos, size: 11, font: helveticaBold, color: corPreta })
  yPos -= 15
  page.drawText("A Rampanelli Planejados agradece pela confiança e preferência! Estamos à disposição para tornar seu projeto realidade.", { x: 60, y: yPos, size: 10, font: helveticaFont, color: corPreta })
  yPos -= 25

  // Observações
  page.drawText("OBSERVAÇÕES", { x: 50, y: yPos, size: 10, font: helveticaBold, color: corPreta })
  yPos -= 15
  const observacoesLinhas = orcamento.observacoes.split("\n")
  observacoesLinhas.forEach((linha) => {
    if (yPos < yMin) return; // Evita sobrepor o rodapé
    page.drawText(linha, { x: MARGEM_ESQUERDA + 10, y: yPos, size: 10, font: helveticaFont, color: corPreta })
    yPos -= 13
  })
  yPos -= 10

  // Termos
  if (yPos > yMin + 20) { // Só imprime se houver espaço suficiente
    page.drawText("TERMOS E CONDIÇÕES", { x: MARGEM_ESQUERDA + 10, y: yPos, size: 10, font: helveticaBold, color: corPreta })
    yPos -= 13
    const terms = [
      "• Pagamentos devem ser realizados em até 15 dias da data do orçamento.",
      "• Uma taxa de 1,5% ao mês será aplicada a pagamentos em atraso.",
      "• Todos os materiais e serviços são cobertos por garantia de 1 ano.",
      "• A entrega está prevista para 15 dias úteis após a aprovação do orçamento.",
      "• Alterações no projeto podem resultar em custos adicionais e atrasos na entrega.",
      "• Este orçamento é válido por 30 dias a partir da data de emissão.",
    ]
    terms.forEach((term) => {
      if (yPos < yMin) return;
      page.drawText(term, { x: MARGEM_ESQUERDA + 10, y: yPos, size: 9, font: helveticaFont, color: corCinza })
      yPos -= 12
    })
    yPos -= 10
  }

  // Rodapé moderno dinâmico
  const bottomMargin = 40;
  yPos = Math.max(yPos, bottomMargin + 25); // Garante espaço mínimo antes do rodapé
  const footerLineY = bottomMargin + 10;
  const footerTextY = bottomMargin;
  const footerText2Y = bottomMargin - 15;
  // Linha divisória
  page.drawLine({ start: { x: 40, y: footerLineY }, end: { x: 555, y: footerLineY }, thickness: 1, color: corCinza });
  // Centraliza o texto do rodapé
  const footerText = "Rampanelli Planejados • Qualidade e Excelência em Móveis Planejados";
  const footerText2 = "contato@rampanelli.com • (11) 99999-9999 • www.rampanelli.com";
  const textWidth = helveticaFont.widthOfTextAtSize(footerText, 9);
  const text2Width = helveticaFont.widthOfTextAtSize(footerText2, 9);
  const centerX = (595 - textWidth) / 2;
  const center2X = (595 - text2Width) / 2;
  page.drawText(footerText, { x: centerX, y: footerTextY, size: 9, font: helveticaFont, color: corPreta });
  page.drawText(footerText2, { x: center2X, y: footerText2Y, size: 9, font: helveticaFont, color: corCinza });
  return await pdfDoc.save()
}
