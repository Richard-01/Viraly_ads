import mysqlDriver from "../../database/mysqlDriver.js";
import createAds from "../../crons/createAds.js";

const createAdsController = async (req, res) => {
  const { userId, language = "es", generateToken = "false" } = req.query;
  const { isValid, message } = validateRequestParams(req.query);

  if (!isValid) {
    return res.status(422).send({
      error: true,
      message,
    });
  }

  let conn = null;
  try {
    conn = await mysqlDriver.awaitGetConnection();

    const userQuery = "SELECT fk_roleId roleId FROM user WHERE id = ?";
    const [user] = await mysqlDriver.awaitQuery(userQuery, [userId]);

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

    if (user.roleId !== 1 && user.roleId !== 2) {
      return res.status(401).send({
        error: true,
        messages: {
          en: "You are not authorized to access this resource",
          es: "No tienes autorización para acceder a este recurso",
          pt: "Você não tem autorização para acessar este recurso",
        },
      });
    }

    res.status(204).send();
    await conn.release();
    conn = null;
    await createAds(language, generateToken);

  } catch (error) {
    console.log("Error al crear los anuncios (Controller):");
    console.log(error);

    return res.status(500).send({
      error: true,
      message: {
        en: "An error occurred while creating the ads, please try again later",
        es: "Ha ocurrido un error al crear los anuncios, por favor intente de nuevo más tarde",
        pt: "Ocorreu um erro ao criar os anúncios, por favor tente novamente mais tarde",
      },
    });
  } finally {
    if (conn) await conn.release();
  }
};

const validateRequestParams = (queryParameters) => {
  const { userId, language } = queryParameters;

  if (!userId || typeof userId !== "string") {
    return {
      isValid: false,
      message: "the field userId is a field require ad must be a string",
    };
  }

  const languages = ["en", "es", "pt"];
  if (
    !language ||
    typeof language !== "string" ||
    !languages.includes(language)
  ) {
    return {
      isValid: false,
      message:
        "the field language is a field require ad must be a string and must be one of the following: " +
        languages.join(", "),
    };
  }

  return { isValid: true, message: null };
};

export default createAdsController;
