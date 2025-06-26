"use client"

import { useOrcamento } from "../contexts/orcamento-provider"
import { FormularioStep } from "./formulario-step"
import { OverviewStep } from "./overview-step"
import { ConfirmacaoStep } from "./confirmacao-step"
import { motion, AnimatePresence } from "framer-motion"

export function OrcamentoForm() {
  const { step } = useOrcamento()

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FormularioStep />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <OverviewStep />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ConfirmacaoStep />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
