function validateProposal(
  services: ServiceItem[],
  description: string
): string | null {
  if (services.length === 0 || description.length === 0) {
    return "At least one service is required";
  }

  for (const service of services) {
    if (!service.description.trim()) {
      return "Service description cannot be empty";
    }

    const amount = Number.parseFloat(service.amount);
    if (isNaN(amount) || amount < 0) {
      return "Amount must be a valid positive number";
    }
  }

  return null;
}

export interface ServiceItem {
  description: string;
  amount: string;
}

export interface SubmitResult {
  success: boolean;
  message: string;
}

export async function submitBudgetProposal(
  services: ServiceItem[],
  proposalDescription: string
): Promise<SubmitResult> {
  try {
    // Validate the proposal data
    const validationError = validateProposal(services, proposalDescription);
    if (validationError) {
      return {
        success: false,
        message: validationError,
      };
    }

    // Calculate total amount
    const totalAmount = services.reduce((sum, service) => {
      return sum + (Number.parseFloat(service.amount) || 0);
    }, 0);

    //need database route

    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Budget proposal submitted:", {
      services,
      proposalDescription,
      totalAmount,
    });

    return {
      success: true,
      message: "Budget proposal submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting budget proposal:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
