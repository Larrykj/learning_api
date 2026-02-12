class BookSerializer < ActiveModel::Serializer
    # Expose only public-facing fields
    attributes :title, :author
end
