import mongoose from 'mongoose';
import connector from '../connector.js';

const getAdsModel = async () => {
  const conn = await connector();

  const attachmentsSchema = new mongoose.Schema(
    {
      description: { type: String, required: false },
      header: { type: String, required: false },
      is_sub: { type: Boolean, required: false },
      link_url: { type: String, required: false },
      link_url_domain: { type: String, required: false },
      media_poster_url: { type: String, required: false },
      media_url: { type: String, required: false },
      media_url_type: { type: String, required: false },
      state: { type: String, required: false },
      title: { type: String, required: false },
      typ: { type: String, required: false },
    },
    { 
      _id: false,
      versionKey: false 
    }
  );

  const linksSchema = new mongoose.Schema(
    {
      __typename: { type: String, required: false },
      landing_domain: { type: String, required: false },
      landing_domain_url: { type: String, required: false },
      landing_ecom_platform: { type: String, required: false },
      landing_page_ref: { type: String, required: false },
      landing_subdomain: { type: String, required: false },
      landing_url: { type: String, required: false },
      redirect_urls: { type: [String], required: false },
      source_url: { type: String, required: false },
      typ: { type: String, required: false },
      unreachable: { type: Boolean, required: false }
    },
    { 
      _id: false,
      versionKey: false 
    }
  );

  const viewersSchema = new mongoose.Schema(
    {
      __typename: { type: String, required: false },
      age: { type: Number, required: false },
      at: { type: String, required: false },
      country_iso_code: { type: String, required: false },
      ip: { type: String, required: false },
      sex: { type: String, required: false },
      user_id: { type: String, required: false }
    },
    { 
      _id: false,
      versionKey: false 
    }
  );

  const snapshotSchema = new mongoose.Schema(
    {
      anger: { type: Number, required: false },
      at: { type: String, required: false },
      comment: { type: Number, required: false },
      haha: { type: Number, required: false },
      like: { type: Number, required: false },
      love: { type: Number, required: false },
      share: { type: Number, required: false },
      sorry: { type: Number, required: false },
      total_reactions: { type: Number, required: false },
      view: { type: Number, required: false },
      wow: { type: Number, required: false },
      __typename: { type: String, required: false }
    },
    { 
      _id: false,
      versionKey: false 
    }
  );
  
  const adsSchema = new mongoose.Schema(
    {
      content: { type: String, required: false },
      content_html: { type: String, required: false },
      creation_date: { type: Date, required: false },
      updatedIn: { type: Date, required: false },
      updateIsPossible: { type: Boolean, required: false },
      cta_text: { type: String, required: false },
      cta_type: { type: String, required: false },
      first_seen_date: { type: Date, required: false },
      format: { type: String, required: false },
      hidden: { type: String, required: false },
      id: { type: String, required: false, unique: true },
      lang_iso_code: { type: String, required: false },
      last_seen_date: { type: Date, required: false },
      link_url: { type: String, required: false },
      link_url_domain: { type: String, required: false },
      page_id: { type: String, required: false },
      page_link_url: { type: String, required: false },
      page_name: { type: String, required: false },
      page_profile_image_url: { type: String, required: false },
      privacy: { type: String, required: false },
      source: { type: String, required: false },
      unreachable: { type: Boolean, required: false },
      url: { type: String, required: false },
      language: { type: String, required: false },
      isCompleted: { type: Boolean, required: false, default: false },
      attachments: { type: [attachmentsSchema], required: false },
      links: { type: [linksSchema], required: false },
      viewers: { type: [viewersSchema], required: false },
      snapshot: { type: snapshotSchema, required: false },
      snapshots: { type: [snapshotSchema], required: false },
    },
    { 
      _id: false,
      versionKey: false 
    }
  );

  return conn.model('ads', adsSchema, 'ads');
};

export default getAdsModel;