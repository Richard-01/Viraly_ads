import mysqlDriverStaging from "../../database/mysqlDriverStaging.js";

const deleteSupplierController = async (req, res) => {
  const { isValid, message } = validateRequestParams(req.query);
  const { userId, productId, pageUrl } = req.query;

  if (!isValid) {
    return res.status(422).send({
      error: true,
      message: message,
    });
  }

  let conn = null;
  try {
    conn = await mysqlDriverStaging.awaitGetConnection();

    const userQuery = "SELECT id, fk_roleId FROM user WHERE id = ?";
    const [user] = await conn.awaitQuery(userQuery, [userId]);

    if (!user) {
      return res.status(422).send({
        error: true,
        messages: {
          en: "The user was not found, please log in again",
          es: "El usuario no fue encontrado, por favor inicia sesión de nuevo",
          pt: "O usuário não foi encontrado, faça login novamente",
        },
      });
    }

    if (user.fk_roleId !== 1 && user.fk_roleId !== 2) {
      return res.status(401).send({
        error: true,
        messages: {
          en: "You are not authorized to perform this action",
          es: "No tienes autorización para realizar esta acción",
          pt: "Você não tem autorização para realizar esta ação",
        },
      });
    }

    const productQuery = "SELECT id FROM product WHERE id = ?";
    const [product] = await conn.awaitQuery(productQuery, [productId]);

    if (!product) {
      return res.status(422).send({
        error: true,
        messages: {
          en: "The product was not found",
          es: "El producto no fue encontrado",
          pt: "O produto não foi encontrado",
        },
      });
    }

    const supplierQuery =
      "DELETE FROM supplier WHERE id = ? AND fk_productId = ?";
    await conn.awaitQuery(supplierQuery, [pageUrl, productId]);

    return res.status(200).send({
      error: false,
      messages: {
        en: "The supplier was deleted successfully",
        es: "El proveedor fue eliminado exitosamente",
        pt: "O fornecedor foi excluído com sucesso",
      },
    });
  } catch (error) {
    console.log("Error al eliminar un proveedor: ");
    console.log("Error ocurrido: ", error);

    return res.status(500).send({
      error: true,
      messages: {
        en: "An unexpected mistake happened, please try again later.",
        es: "Ocurrió un error inesperado, por favor intentalo de nuevo más tarde.",
        pt: "Um erro inesperado aconteceu, tente novamente mais tarde.",
      },
    });
  } finally {
    if (conn) await conn.release();
  }
};

const validateRequestParams = (queryParameters) => {
  const { userId, pageUrl, productId } = queryParameters;

  if (!userId || typeof userId !== "string") {
    return {
      isValid: false,
      message: "the field userId is a field require ad must be a string",
    };
  }

  if (!productId || typeof productId !== "string") {
    return {
      isValid: false,
      message: "the field productId is a field require ad must be a string",
    };
  }

  if (!pageUrl || typeof pageUrl !== "string") {
    return {
      isValid: false,
      message: `${pageUrl} is not a valid url`,
    };
  }

  if (!pageUrl.includes("alibaba.com")) {
    return {
      isValid: false,
      message: `${pageUrl} is not a String data type.`,
    };
  }

  return { isValid: true, message: null };
};

export default deleteSupplierController;
